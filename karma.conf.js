process.env.ethTest = 'TransactionTests';

module.exports = function (config) {
  config.set({
    frameworks: ['tap', 'karma-typescript'],
    files: ['./src/**/*.ts', './test/**/*.ts'],
    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },
    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.ts$/,
        acornOptions: {
          ecmaVersion: 12,
        },
        addNodeGlobals: true,
        transforms: [
          require('karma-typescript-es6-transform')({
            presets: [['@babel/preset-env', { targets: { chrome: '74' } }]],
          }),
        ],
      },
      tsconfig: './tsconfig.json',
    },
    browsers: ['ChromeHeadless'],
    singleRun: true,
    concurrency: 1,
    browserNoActivityTimeout: 60000,
  });
};
