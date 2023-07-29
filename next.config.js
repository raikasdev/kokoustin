/** @type {import('next').NextConfig} */

// Get hash and version
const commitHash = require("child_process")
  .execSync('git log --pretty=format:"%h" -n1')
  .toString()
  .trim();
const pkg = require("./package.json");

const nextConfig = {
  // reactStrictMode: true,
  env: {
    // add the package.json version and git hash to the environment
    APP_VERSION: pkg.version,
    COMMIT_HASH: commitHash,
  },
};

module.exports = nextConfig;
