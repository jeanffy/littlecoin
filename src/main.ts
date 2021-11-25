import * as fs from 'fs';
import { Block, blockConfig, mineNewBlock, printBlock } from './block';
import { Blockchain, blockchainConfig, loadBlockchain, saveBlockchain } from './blockchain';
import { AddParameters, AppCommand, CommandLineArgs, commandLineArgs, InitParameters } from './command-line-args';

function initializeBlockchain(params: InitParameters): void {
  if (fs.existsSync(params.blockchainPath)) {
    if (params.force) {
      console.warn(`Warning: Blockchain already exists at '${params.blockchainPath}', overwriting as per user request`);
    } else {
      console.error(`Error: Blockchain already exists at '${params.blockchainPath}'`);
      return;
    }
  }

  console.log(`Creating blockchain in '${params.blockchainPath}'...`);

  const blockchain: Blockchain = [];

  const fakePreviousBlock: Block = {
    version: blockConfig.version,
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
    console.error('Error: Cannot mine genesis block');
    return;
  }

  blockchain.push(genesisBlock);
  saveBlockchain(blockchain, params.blockchainPath);

  console.log('Done.');
}

function addBlockToBlockchain(params: AddParameters): void {
  console.log(`Adding new block to blockchain '${params.blockchainPath}'...`);

  const blockchain = loadBlockchain(params.blockchainPath);

  console.log('Mining block...');

  const newBlock = mineNewBlock({
    previousBlock: blockchain[blockchain.length - 1],
    numberOfLeadingZeroes: blockchainConfig.numberOfLeadingZeroes,
    maxTries: params.maxTries,
    payload: params.payload
  });

  if (newBlock === undefined) {
    console.error(`Error: Cannot mine new block`);
    return;
  }

  if (params.dryRun) {
    console.log('Info: Dry run requested, blockchain not modified')
  } else {
    blockchain.push(newBlock);
    saveBlockchain(blockchain, params.blockchainPath);
  }

  console.log('Done.');
  console.log('Generated block:');
  printBlock(newBlock);
}

function main(): void {
  try {
    switch (CommandLineArgs.getCommand()) {
      case AppCommand.Init: initializeBlockchain(CommandLineArgs.getInitParameters()); break;
      case AppCommand.Add: addBlockToBlockchain(CommandLineArgs.getAddParameters()); break;
    }
  } catch (error) {
    console.error(`Error: ${JSON.stringify(error)}`);
    if (error instanceof Error) {
      console.error(`${error.stack}`);
    }
  }
}

main();
