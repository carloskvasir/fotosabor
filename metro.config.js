const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .cjs files (for Firebase)
config.resolver.sourceExts.push('cjs');

// Disable package exports to avoid Firebase compatibility issues
config.resolver.unstable_enablePackageExports = false;

// Add node_modules to resolver platforms
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;
