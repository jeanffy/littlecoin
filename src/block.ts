import crypto from 'node:crypto';
import { Logger } from './logger.js';

export const blockConfig = {
  version: 1,
};

export class LLCBlock {
  public version: number;
  public height: number;
  public previousHash: string;
  public horodate: string;
  public payload: string;
  public nonce: number;
  public hash: string;

  public constructor(previousBlock: LLCBlock) {
    this.version = blockConfig.version;
    this.height = previousBlock.height + 1;
    this.previousHash = previousBlock.hash;
    this.horodate = new Date().toISOString();
    this.payload = '';
    this.nonce = 0;
    this.hash = '';
  }
}

export interface Block {
  version: number;
  index: number;
  previousHash: string;
  horodate: string;
  payload: string;
  nonce: number;
  hash: string;
}

export interface NewBlockArgs {
  previousBlock: Block;
  numberOfLeadingZeroes: number;
  maxTries?: number;
  payload: string;
}

export function mineNewBlock(args: NewBlockArgs, logger: Logger): Block | undefined {
  const start = new Date();
  logger.info(`Mining started at ${start.toISOString()}`);

  const maxTries = args.maxTries === undefined ? Number.MAX_SAFE_INTEGER : args.maxTries;
  const expected = '0'.repeat(args.numberOfLeadingZeroes);
  logger.info('Parameters:');
  logger.info(`- maxTries: ${maxTries === Number.MAX_SAFE_INTEGER ? 'infinite' : maxTries}`);
  logger.info(`- numberOfLeadingZeroes: ${args.numberOfLeadingZeroes}`);

  const newBlock: Block = {
    version: blockConfig.version,
    index: args.previousBlock.index + 1,
    previousHash: args.previousBlock.hash,
    horodate: new Date().toISOString(),
    payload: args.payload,
    nonce: 0,
    hash: '',
  };

  for (let i = 0; i < maxTries; i++) {
    newBlock.nonce = i;
    newBlock.hash = '';
    const newBlockStr = JSON.stringify(newBlock);
    newBlock.hash = crypto.createHash('sha256').update(newBlockStr).digest('hex');
    if (newBlock.hash.startsWith(expected)) {
      const end = new Date();
      logger.info(`Nonce found at ${end.toISOString()} (duration ${(end.getTime() - start.getTime()) / 1000}s)`);
      logger.info(`${i} iterations`);
      return newBlock;
    }
  }

  return undefined;
}

export function printBlock(block: Block, logger: Logger): void {
  logger.info(`- version: ${block.version}`);
  logger.info(`- index: ${block.index}`);
  logger.info(`- previousHash: ${block.previousHash}`);
  logger.info(`- horodate: ${block.horodate}`);
  logger.info(`- payload: ${block.payload}`);
  logger.info(`- nonce: ${block.nonce}`);
  logger.info(`- hash: ${block.hash}`);
}
