import * as path from 'path';
import * as fs from 'fs';
import { FancyMap } from '@straw-hat/fancy-map';
import { createDebugger } from '../debug';
import resolve from 'resolve';
import { TsConfig } from '../types';
import makeDir from 'make-dir';

const debug = createDebugger('helpers');
const cache = new FancyMap<string, any>();

export function setNodeEnv(env: 'development' | 'production' | 'test') {
  process.env.NODE_ENV = env;
  debug(`NODE_ENV: ${env}`);
}

export function isCI() {
  return !!process.env.CI;
}

export function getCwd() {
  return fs.realpathSync(process.cwd());
}

export function getShcConfig(context: string) {
  return cache.getOrSet('SHC_CONFIG', () => loadConfig(context));
}

export function getTsConfig(context: string): TsConfig {
  const filePath = path.join(context, 'tsconfig.json');
  const hasTsConfig = fs.existsSync(filePath);

  const defaultConfig = { compilerOptions: {} };

  if (!hasTsConfig) {
    return defaultConfig;
  }

  const ts = require(resolve.sync('typescript', {
    basedir: path.join(context, 'node_modules'),
  }));

  return ts.readConfigFile(filePath, ts.sys.readFile).config;
}

function loadConfig(context: string) {
  const filePath = path.resolve(context, 'shc.config.js');

  if (!fs.existsSync(filePath)) {
    return {};
  }

  debug(`Configuration file found. Loading ${filePath}`);

  try {
    return require(filePath);
  } catch (e) {
    throw new Error(`Failed to load SHC configuration file ${filePath}.\n${e.message}`);
  }
}

export function touchFileSync(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    if (stats && stats.isFile()) return filePath;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }

    makeDir.sync(path.dirname(filePath));
  }

  fs.writeFileSync(filePath, '');

  return filePath;
}
