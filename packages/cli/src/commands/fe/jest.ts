import * as jest from 'jest-cli';
import { BaseCommand } from '@straw-hat/cli-core/dist/base-command';
import { getCwd, getShcConfig, isCI, setNodeEnv } from '@straw-hat/cli-core/dist/helpers';
import { createBaseConfig } from '../../jest';

export class JestCommand extends BaseCommand {
  static description = [
    'runs Jest. Visit https://jestjs.io/docs/en/cli for more information about',
    'available options, --config flag is disabled, use shc.config.js instead',
  ].join(' ');

  static strict = false;

  async run() {
    setNodeEnv('test');

    const { argv } = this.parse(JestCommand);
    const context = getCwd();
    const shcConfig = getShcConfig(context);
    const jestConfig = createBaseConfig({ context });

    shcConfig?.commands?.fe?.jest?.config?.(jestConfig);

    argv.push('--config', JSON.stringify(jestConfig.toConfig()));

    if (isCI()) {
      argv.push('--ci');
    }

    await jest.run(argv);
  }
}
