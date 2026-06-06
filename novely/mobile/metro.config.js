const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
 
const config = getDefaultConfig(__dirname);

// ADICIONE ESTAS DUAS LINHAS: Garante suporte a pacotes modernos em ESM como o Lucide
config.resolver.sourceExts.push('mjs');
config.resolver.sourceExts.push('cjs');
 
module.exports = withNativeWind(config, { input: './globals.css' });