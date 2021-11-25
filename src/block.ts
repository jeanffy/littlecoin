import * as crypto from 'crypto';

export const blockConfig = {
  version: 1
};

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

export function mineNewBlock(args: NewBlockArgs): Block | undefined {
  const start = new Date();
  console.log(`Mining started at ${start.toISOString()}`);

  const maxTries = (args.maxTries === undefined ? Number.MAX_SAFE_INTEGER : args.maxTries);
  const expected = '0'.repeat(args.numberOfLeadingZeroes);
  console.log('Parameters:');
  console.log(`- maxTries: ${maxTries === Number.MAX_SAFE_INTEGER ? 'infinite' : maxTries}`);
  console.log(`- numberOfLeadingZeroes: ${args.numberOfLeadingZeroes}`);

  const newBlock: Block = {
    version: blockConfig.version,
    index: args.previousBlock.index + 1,
    previousHash: args.previousBlock.hash,
    horodate: new Date().toISOString(),
    payload: args.payload,
    nonce: 0,
    hash: ''
  };

  for (let i = 0; i < maxTries; i++) {
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

export function printBlock(block: Block): void {
  console.log(`- version: ${block.version}
- index: ${block.index}
- previousHash: ${block.previousHash}
- horodate: ${block.horodate}
- payload: ${block.payload}
- nonce: ${block.nonce}
- hash: ${block.hash}`);
}
