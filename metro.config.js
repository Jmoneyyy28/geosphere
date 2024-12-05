// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("obj")
config.resolver.assetExts.push("mtl")
config.resolver.assetExts.push("glb")
config.resolver.assetExts.push("gltf")
config.resolver.assetExts.push("bin")

module.exports = config;
