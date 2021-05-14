import envinfo from 'envinfo';
import { BaseCommand, Flags } from '@straw-hat/cli-core/dist/base-command';
import { log } from '@straw-hat/cli-core/dist/log';

const PACKAGES = ['@straw-hat/cli', '@straw-hat/cli-*', 'typescript'];

export default class InfoCommand extends BaseCommand {
  static description = 'gather relevant information about the CLI';

  static flags = {
    json: Flags.boolean({
      default: false,
      description: 'Output the report as JSON',
    }),
  };

  async run() {
    const { flags } = this.parse(InfoCommand);

    envinfo
      .run(
        {
          System: ['OS', 'Shell'],
          Binaries: ['Node', 'Yarn', 'npm', 'Watchman'],
          npmPackages: PACKAGES,
          npmGlobalPackages: PACKAGES,
        },
        {
          json: flags.json,
          showNotFound: true,
          duplicates: true,
          fullTree: true,
        }
      )
      .then(log);
  }
}
