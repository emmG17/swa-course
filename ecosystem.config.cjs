module.exports = {
  apps: [
    {
      name: "lumina",
      script: "dist/index.js",
      interpreter: "bun",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
