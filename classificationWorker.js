import { parentPort } from 'worker_threads';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs-node';
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/libsql';
import { eq, isNull } from 'drizzle-orm';
import { galleryTable, imageClassesTable } from './schema.js';

const db = drizzle('file:local.db');
let mobilenetModel;

// Load the MobileNet model and process unclassified photos on worker start
(async () => {
    mobilenetModel = await mobilenet.load();
    console.log('MobileNet model loaded in worker.');

    // Fetch unclassified photos from the database
    const unclassifiedPhotos = await db
        .select()
        .from(galleryTable)
        .where(isNull(galleryTable.classifiedAt))
        .all();

    if (unclassifiedPhotos.length > 0) {
        const photoIds = unclassifiedPhotos.map((photo) => photo.id);
        parentPort.postMessage({ photoIds }); // Send unclassified photo IDs to the worker
        console.log(
            `Worker initialized with ${photoIds.length} unclassified photos.`
        );
    } else {
        console.log('No unclassified photos found on worker start.');
    }
})();

parentPort.on('message', async (message) => {
    const { photoIds } = message;

    for (const photoId of photoIds) {
        const photo = await db
            .select()
            .from(galleryTable)
            .where(eq(galleryTable.id, photoId))
            .get();

        if (!photo) {
            console.warn(`Photo not found in database: ID ${photoId}`);
            continue;
        }

        const imagePath = path.join('uploads', photo.filename);

        if (!fs.existsSync(imagePath)) {
            console.warn(`File not found: ${imagePath}`);
            continue;
        }

        const imageBuffer = fs.readFileSync(imagePath);
        const decodedImage = tf.node.decodeImage(imageBuffer);

        const predictions = await mobilenetModel.classify(decodedImage);

        const classRecords = predictions.map((prediction) => ({
            imageId: photo.id,
            className: prediction.className,
            probability: prediction.probability,
        }));

        await db.insert(imageClassesTable).values(classRecords);

        // Mark the photo as classified by setting classifiedAt to the current timestamp
        await db
            .update(galleryTable)
            .set({ classifiedAt: Math.floor(Date.now() / 1000) })
            .where(eq(galleryTable.id, photo.id));

        console.log(`Classified image: ID ${photoId}`);
    }

    parentPort.postMessage('Classification completed for batch.');
});
