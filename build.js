import esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['./server.js'], // Path to your server.js
        outfile: './dist.js', // Output file
        bundle: true, // Bundle all dependencies into one file
        platform: 'node', // Target Node.js environment
        target: 'node18', // Adjust based on your Node.js version
        external: ['express'], // Exclude dependencies you want to keep as external
        minify: true, // Optional: Minify the output
        sourcemap: false, // Optional: Add sourcemaps for debugging
    })
    .then(() => {
        console.log('Server bundled successfully!');
    })
    .catch((err) => {
        console.error('Error during bundling:', err);
        process.exit(1);
    });
