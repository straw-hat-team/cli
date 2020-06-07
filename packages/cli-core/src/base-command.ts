import Command from '@oclif/command';
import chalk from 'chalk';
import ciInfo from 'ci-info';
import { createDebugger } from './debug';

export abstract class BaseCommand extends Command {
  debug = createDebugger('base-command');

  async init() {
    const ciName = ciInfo.name ?? 'CI';
    this.debug(`${this.config.name}: ${chalk.green(this.config.version)}`);
    this.debug(`Running on ${ciName}`);
  }
}
