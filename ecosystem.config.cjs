module.exports = {
  apps: [
    {
      name: "com",
      script: "server.js",
      instances: 1, // Set to 'max' for cluster mode,
      mode: "fork",
      autorestart: true,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
