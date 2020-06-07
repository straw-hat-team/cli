import envinfo from 'envinfo';
import { BaseCommand } from '@straw-hat/cli-core/dist/base-command';
import { log } from '@straw-hat/cli-core/dist/log';

export default class InfoCommand extends BaseCommand {
  static description = 'Gather relevant information about the CLI.';

  async run() {
    envinfo
      .run(
        {
          System: ['OS', 'Shell'],
          Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
          npmPackages: '/**/{typescript,@straw-hat/*/}',
          npmGlobalPackages: ['@straw-hat/cli', '@straw-hat/*'],
        },
        {
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        }
      )
      .then(log);
  }
}
