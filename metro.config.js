const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add minification and optimization
config.transformer.minifierConfig = {
  keep_fnames: false,
  mangle: {
    keep_fnames: false,
  },
};

// Exclude unnecessary files
config.resolver.blockList = [
  /.*\/__tests__\/.*/,
  /.*\.test\.(js|jsx|ts|tsx)$/,
  /.*\.spec\.(js|jsx|ts|tsx)$/,
  /.*\.stories\.(js|jsx|ts|tsx)$/,
];

// Optimize asset resolution
config.resolver.assetExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ttf', 'otf'];

module.exports = config;
