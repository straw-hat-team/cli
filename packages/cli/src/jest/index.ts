import * as path from 'path';
import * as fs from 'fs';
import { JestConfigChain } from '@straw-hat/jest-config-chain';

function getSetupFileFor(fileName: string) {
  return (context: string) => {
    return ['mjs', 'js', 'jsx', 'ts', 'tsx']
      .map((ext) => path.resolve(context, 'tests', 'jest', `${fileName}.${ext}`))
      .find(fs.existsSync);
  };
}

const getSetupFilesAfterEnv = getSetupFileFor('jest.setupFramework');
const getSetupFiles = getSetupFileFor('jest.setup');

export function createBaseConfig(args: { context: string }) {
  const config = new JestConfigChain();

  config.collectCoverageFrom.add(`<rootDir>/src/**/*.{mjs|js|jsx|ts|tsx}`).add(`<rootDir>/lib/**/*.{mjs|js}`);

  config.coverageDirectory('<rootDir>/coverage');

  config.coveragePathIgnorePatterns.add('/node_modules/').add('.d.ts$');

  config.moduleFileExtensions
    .set('node', 'node')
    .set('json', 'json')
    .set('mjs', 'mjs')
    .set('js', 'js')
    .set('jsx', 'jsx')
    .set('jsx', 'jsx')
    .set('ts', 'ts')
    .set('tsx', 'tsx');

  config.roots.add('<rootDir>/tests/jest/');

  config.testMatch.add('<rootDir>/tests/jest/**/*.test.{mjs|js|jsx|ts|tsx}');

  config.moduleNameMapper.set('^@/(.*)$', ['<rootDir>/src/$1', '<rootDir>/lib/$1']);

  config.watchPlugins.add('jest-watch-typeahead/filename').add('jest-watch-typeahead/testname');

  config.testEnvironment('node');

  config.transform
    .set('.(ts|tsx)$', require.resolve('ts-jest/dist'))
    .set('.(mjs|js|jsx)$', require.resolve('babel-jest'));

  const setupFiles = getSetupFiles(args.context);
  if (setupFiles) {
    config.setupFiles.add(setupFiles);
  }

  const setupFilesAfterEnv = getSetupFilesAfterEnv(args.context);
  if (setupFilesAfterEnv) {
    config.setupFilesAfterEnv.add(setupFilesAfterEnv);
  }

  return config;
}
