const path= require("path");

module.exports = {
  packagerConfig: {
    "icon": "./build/YTlogo4.ico"
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        "setupIcon": path.resolve(__dirname, 'build', 'YTlogo4.ico'),
        "loadingGif": "build/loading.gif",
        "skipUpdateIcon": true
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'win32']
    },
    {
      name: '@electron-forge/maker-deb',
      platforms: ['linux']
    },
    {
      name: '@electron-forge/maker-rpm',
      platforms: ['linux']
    },
  ],
};
