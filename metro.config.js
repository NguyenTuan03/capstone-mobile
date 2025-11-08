// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix module resolution for metro-runtime
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    // Ensure metro-runtime resolves to the top-level package
    "metro-runtime": path.resolve(__dirname, "node_modules/metro-runtime"),
  },
};

// Ensure watchFolders includes necessary paths
config.watchFolders = [
  ...(config.watchFolders || []),
  path.resolve(__dirname, "node_modules"),
];

module.exports = config;
