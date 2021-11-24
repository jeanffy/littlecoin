import * as fs from 'fs';
import { Block } from './block';

export const blockchainConfig = {
  numberOfLeadingZeroes: 5
};

export type Blockchain = Block[];

export function loadBlockchain(filePath: string): Blockchain {
  const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const blockchain = JSON.parse(fileContent) as Blockchain;
  if (blockchain.length === 0) {
    throw new Error(`Invalid blockchain '${filePath}'`);
  }
  return blockchain.reverse();
}

export function saveBlockchain(blockchain: Blockchain, filePath: string): void {
  fs.writeFileSync(filePath, JSON.stringify(blockchain.reverse(), undefined, 2), { encoding: 'utf-8' });
}
