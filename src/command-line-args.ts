import * as yargs from 'yargs';

export enum AppCommand {
  Init = 'init',
  Add = 'add'
}

export const commandLineArgs: any = yargs
  .boolean('help').describe('help', 'Display this help')
  .command(AppCommand.Init, 'Initialize blockchain', (y: yargs.Argv) => y
  )
  .command(AppCommand.Add, 'Add a block to the blockchain', (y: yargs.Argv) => y
    .option('payload', { type: 'string', alias: 'p', demandOption: true })
  )
  .demandCommand(1)
  .strict()
  .wrap(yargs.terminalWidth())
  .argv;

export function getCommand(): string {
  return commandLineArgs._[0];
}

export interface AddParameters {
  payload: string;
}
