import fs from 'node:fs';
import dotenv from 'dotenv';
import { Block, blockConfig, mineNewBlock, printBlock } from './block.js';
import { Blockchain, blockchainConfig, loadBlockchain, saveBlockchain } from './blockchain.js';
import { AddParameters, CommandLineArgs, InitParameters } from './command-line-args.js';
import { Logger } from './logger.js';

dotenv.config();
const logger = new Logger();

function initializeBlockchain(params: InitParameters): void {
  if (fs.existsSync(params.blockchainPath)) {
    if (params.force) {
      logger.warning(
        `Warning: Blockchain already exists at '${params.blockchainPath}', overwriting as per user request`,
      );
    } else {
      logger.warning(`Error: Blockchain already exists at '${params.blockchainPath}'`);
      return;
    }
  }

  logger.info(`Creating blockchain in '${params.blockchainPath}'...`);

  const blockchain: Blockchain = [];

  const fakePreviousBlock: Block = {
    version: blockConfig.version,
    index: -1,
    previousHash: '0'.repeat(64),
    horodate: new Date().toISOString(),
    payload: '',
    nonce: 0,
    hash: '0'.repeat(64),
  };

  logger.info('Mining genesis block...');

  const genesisBlock = mineNewBlock(
    {
      previousBlock: fakePreviousBlock,
      numberOfLeadingZeroes: blockchainConfig.numberOfLeadingZeroes,
      payload: 'This is genesis block',
    },
    logger,
  );

  if (genesisBlock === undefined) {
    logger.error('Error: Cannot mine genesis block');
    return;
  }

  blockchain.push(genesisBlock);
  saveBlockchain(blockchain, params.blockchainPath);

  logger.info('Done.');
}

function addBlockToBlockchain(params: AddParameters): void {
  logger.info(`Adding new block to blockchain '${params.blockchainPath}'...`);

  const blockchain = loadBlockchain(params.blockchainPath);

  logger.info('Mining block...');

  const newBlock = mineNewBlock(
    {
      previousBlock: blockchain[blockchain.length - 1],
      numberOfLeadingZeroes: blockchainConfig.numberOfLeadingZeroes,
      maxTries: params.maxTries,
      payload: params.payload,
    },
    logger,
  );

  if (newBlock === undefined) {
    logger.error(`Error: Cannot mine new block`);
    return;
  }

  if (params.dryRun) {
    logger.info('Info: Dry run requested, blockchain not modified');
  } else {
    blockchain.push(newBlock);
    saveBlockchain(blockchain, params.blockchainPath);
  }

  logger.info('Done.');
  logger.info('Generated block:');
  printBlock(newBlock, logger);
}

function main(): void {
  try {
    if (process.env.DEBUG === '1' && process.env.DEBUG_ARGV !== undefined) {
      process.argv = [...process.argv, ...JSON.parse(process.env.DEBUG_ARGV)];
    }
    const commandLineArgs = new CommandLineArgs();
    if (commandLineArgs.initParameters !== undefined) {
      initializeBlockchain(commandLineArgs.initParameters);
    } else if (commandLineArgs.addParameters !== undefined) {
      addBlockToBlockchain(commandLineArgs.addParameters);
    }
  } catch (error) {
    logger.exception(error, '');
  }
}

main();
