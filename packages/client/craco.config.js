const presetReact = require('@babel/preset-react').default;
const presetCRA = require('babel-preset-react-app');

module.exports = {
  babel: {
    // loaderOptions: (babelLoaderOptions, { env, paths }) => {
    pluginOptions: (babelLoaderOptions) => {
      const origBabelPresetReactAppIndex = babelLoaderOptions.presets.findIndex((preset) => {
        return preset[0].includes('babel-preset-react-app');
      });

      if (origBabelPresetReactAppIndex === -1) {
        return babelLoaderOptions;
      }

      babelLoaderOptions.presets[origBabelPresetReactAppIndex] = (...args) => {
        const babelPresetReactAppResult = presetCRA(...args);
        const origPresetReact = babelPresetReactAppResult.presets.find((preset) => {
          return preset[0] === presetReact;
        });
        Object.assign(origPresetReact[1], {
          importSource: '@welldone-software/why-did-you-render',
        });
        return babelPresetReactAppResult;
      };

      return babelLoaderOptions;
    },
  },
};
