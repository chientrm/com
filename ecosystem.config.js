module.exports = {
    apps: [
        {
            name: "com",
            script: "build/index.js",
            cwd: "./",
            env: {
                PORT: 4000,
                NODE_ENV: "production"
            }
        }
    ]
};
