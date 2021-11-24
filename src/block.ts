import * as crypto from 'crypto';

const blockMiningConfig = {
  maxIterations: 10000000
};

export interface Block {
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
  payload: string;
}

export function mineNewBlock(args: NewBlockArgs): Block | undefined {
  const start = new Date();
  console.log(`Mining started at ${start.toISOString()}`);

  const maxIterations = blockMiningConfig.maxIterations;
  const expected = '0'.repeat(args.numberOfLeadingZeroes);

  const newBlock: Block = {
    index: args.previousBlock.index + 1,
    previousHash: args.previousBlock.hash,
    horodate: new Date().toISOString(),
    payload: args.payload,
    nonce: 0,
    hash: ''
  };

  for (let i = 0; i < maxIterations; i++) {
    newBlock.nonce = i;
    newBlock.hash = '';
    const newBlockStr = JSON.stringify(newBlock);
    newBlock.hash = crypto.createHash('sha256').update(newBlockStr).digest('hex');
    if (newBlock.hash.startsWith(expected)) {
      const end = new Date();
      console.log(`Nonce found at ${end.toISOString()} (duration ${(end.getTime() - start.getTime()) / 1000}s)`);
      return newBlock;
    }
  }

  return undefined;
}
