import Command from '@oclif/command';
import chalk from 'chalk';
import ciInfo from 'ci-info';

export abstract class BaseCommand extends Command {
  async init() {
    const ciName = ciInfo.name ?? 'CI';
    this.debug(`${this.config.name}: ${chalk.green(this.config.version)}`);
    this.debug(`Running on ${ciName}`);
  }
}
