import * as path from 'path';
import { Block, mineNewBlock } from './block';
import { Blockchain, blockchainConfig, loadBlockchain, saveBlockchain } from './blockchain';
import { AddParameters, AppCommand, commandLineArgs, getCommand } from './command-line-args';

function initializeBlockchain(filePath: string): void {
  console.log('Creating blockchain...');

  const blockchain: Blockchain = [];

  const fakePreviousBlock: Block = {
    index: -1,
    previousHash: '0'.repeat(64),
    horodate: new Date().toISOString(),
    payload: '',
    nonce: 0,
    hash: '0'.repeat(64)
  };

  console.log('Mining genesis block...');

  const genesisBlock = mineNewBlock({
    previousBlock: fakePreviousBlock,
    numberOfLeadingZeroes: blockchainConfig.numberOfLeadingZeroes,
    payload: 'This is genesis block'
  });

  if (genesisBlock === undefined) {
    throw new Error('Cannot mine genesis block');
  }

  blockchain.push(genesisBlock);
  saveBlockchain(blockchain, filePath);

  console.log('Done.');
}

function addBlockToBlockchain(filePath: string, payload: string): void {
  console.log('Adding new block to blockchain...');

  const blockchain = loadBlockchain(filePath);

  console.log('Mining block...');

  const newBlock = mineNewBlock({
    previousBlock: blockchain[blockchain.length - 1],
    numberOfLeadingZeroes: blockchainConfig.numberOfLeadingZeroes,
    payload: payload
  });

  if (newBlock === undefined) {
    throw new Error('Cannot mine new block');
  }

  blockchain.push(newBlock);
  saveBlockchain(blockchain, filePath);

  console.log('Done.');
}

function main(): void {
  try {
    const blockchainFilePath = path.join(process.cwd(), 'data', 'blockchain.json');
    switch (getCommand()) {
      case AppCommand.Init: initializeBlockchain(blockchainFilePath); break;
      case AppCommand.Add: addBlockToBlockchain(blockchainFilePath, (commandLineArgs as AddParameters).payload); break;
    }
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(`${error.stack}`);
    }
  }
}

main();
