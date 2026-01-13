const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// 🚫 REMOVE css from sourceExts so Babel never sees it
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  (ext) => ext !== "css"
);

module.exports = withNativeWind(config, {
  input: "./global.css",
});
