import * as yargs from 'yargs';

export enum AppCommand {
  Init = 'init',
  Add = 'add'
}

export const commandLineArgs: any = yargs
  .boolean('help').describe('help', 'Display this help')
  .command(AppCommand.Init, 'Initialize blockchain', (y: yargs.Argv) => y
    .option('blockchain-path', { description: 'Blockchain file path', type: 'string', alias: 'b', demandOption: true })
    .option('force', { description: 'Force writing file if already exists', type: 'boolean', default: false })
  )
  .command(AppCommand.Add, 'Add a block to the blockchain', (y: yargs.Argv) => y
    .option('blockchain-path', { description: 'Blockchain file path', type: 'string', alias: 'b', demandOption: true })
    .option('payload', { descriptione: 'Payload to include in block', type: 'string', alias: 'p', demandOption: true })
    .option('max-tries', { description: 'Maximum number of tries to find a nonce', type: 'number', default: undefined })
    .option('dry-run', { description: 'Mine the block without adding it to the blockchain', type: 'boolean', default: false })
  )
  .demandCommand(1)
  .strict()
  .wrap(yargs.terminalWidth())
  .argv;

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

export namespace CommandLineArgs {
  export function getCommand(): string {
    return commandLineArgs._[0];
  }

  export function getInitParameters(): InitParameters {
    return commandLineArgs as InitParameters;
  }

  export function getAddParameters(): AddParameters {
    return commandLineArgs as AddParameters;
  }
}
