import { Command, InvalidArgumentError } from 'commander';

export enum AppCommand {
  Init = 'init',
  Add = 'add',
}

export interface InitParameters {
  blockchainPath: string;
  force: boolean;
}

export interface AddParameters {
  blockchainPath: string;
  payload: string;
  maxTries?: number;
  dryRun: boolean;
}

function myParseInt(value: string): number {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new InvalidArgumentError('');
  }
  return parsedValue;
}

export class CommandLineArgs {
  private program = new Command();

  public command?: AppCommand;
  public initParameters?: InitParameters;
  public addParameters?: AddParameters;

  public constructor() {
    this.program
      .command(AppCommand.Init)
      .description('Initialize blockchain')
      .requiredOption('-b, --blockchain-path <value>', 'Blockchain file path')
      .option('--force', 'Force writing file if already exists', false)
      .action(options => {
        this.command = AppCommand.Init;
        this.initParameters = {
          blockchainPath: options.blockchainPath,
          force: options.force,
        };
      });

    this.program
      .command(AppCommand.Add)
      .description('Add a block to the blockchain')
      .requiredOption('-b, --blockchain-path <value>', 'Blockchain file path')
      .requiredOption('-p, --payload <value>', 'Payload to include in block')
      .option('--max-tries <value>', 'Maximum number of tries to find a nonce', myParseInt)
      .option('--dry-run', 'Mine the block without adding it to the blockchain', false)
      .action(options => {
        this.command = AppCommand.Add;
        this.addParameters = {
          blockchainPath: options.blockchainPath,
          payload: options.payload,
          maxTries: options.maxTries,
          dryRun: options.dryRun,
        };
      });

    this.program.parse();
  }
}
