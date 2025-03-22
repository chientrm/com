import esbuild from 'esbuild';

esbuild
    .build({
        entryPoints: ['./server/index.js'], // Path to your server.js
        outfile: './dist.js', // Output file
        bundle: true, // Bundle all dependencies into one file
        platform: 'node', // Target Node.js environment
        target: 'node18', // Adjust based on your Node.js version
        format: 'cjs', // Set output format to ESM for import.meta support
        minify: true, // Optional: Minify the output
        sourcemap: false, // Optional: Add sourcemaps for debugging
    })
    .then(() => {
        console.log('Server bundled successfully!');
    });
