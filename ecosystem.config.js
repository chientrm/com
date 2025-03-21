module.exports = {
  apps: [
    {
      name: "com",
      script: "build/index.js",
      instances: 1, // Single instance
      exec_mode: "fork", // Use fork mode
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
