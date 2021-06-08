const { pathsToModuleNameMapper } = require('ts-jest/utils');
// Load the config which holds the path aliases.
const { compilerOptions } = require('../../tsconfig.json');

module.exports = {

  "testMatch": [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },

  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths , {
    // This has to match the baseUrl defined in tsconfig.json.
    prefix: '<rootDir>/../../'
  })
};