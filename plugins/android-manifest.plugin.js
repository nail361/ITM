const { AndroidConfig, withAndroidManifest } = require("@expo/config-plugins");

module.exports = function androiManifestPlugin(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      androidManifest,
      "com.google.android.geo.API_KEY",
      "",
      "value",
    );

    return config;
  });
};
