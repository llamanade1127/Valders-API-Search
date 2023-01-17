module.exports = {
  packagerConfig: {},
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: './src/assets/print-icon.png',
        format: 'ULFO'
      }
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'Matthew Storm',
          homepage: 'https://github.com/llamanade1127/Valders-API-Search'
        }
      }
    }
  ],

  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        authToken: "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",
        repository: {
          owner: 'llamanade1127',
          name: 'Valders-API-Search'
        },
        prerelease: false
      }
    }
  ]
};
