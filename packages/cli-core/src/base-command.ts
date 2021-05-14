import Command, { flags } from '@oclif/command';
import chalk from 'chalk';
import ciInfo from 'ci-info';
import { createDebugger } from './debug';

export const Flags = flags;

export abstract class BaseCommand extends Command {
  debug = createDebugger('base-command');

  async init() {
    this.debug(`${this.config.name}: ${chalk.green(this.config.version)}`);
    const ciName = ciInfo.name ?? 'Unknown Continuous Integration environment';
    this.debug(`Running on ${ciName}`);
  }

  async catch(error: Error | string) {
    if (error === '') {
      this.exit(1);
    }

    this.error(error);
  }
}
