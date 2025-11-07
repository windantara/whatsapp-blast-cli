#!/usr/bin/env node

/**
 * WhatsApp Blast CLI v2.0
 * Modern, enhanced version with better error handling,
 * logging, retry mechanism, and progress tracking
 * 
 * @author windantara
 * @license MIT
 */

const chalk = require('chalk');
const config = require('./config');
const logger = require('./logger');
const WhatsAppClient = require('./whatsapp');
const BlastManager = require('./blast');
const { ensureDirectories } = require('./utils');

/**
 * Initialize application
 */
async function initialize() {
  try {
    // Display startup message
    console.clear();
    console.log(chalk.cyan('═══════════════════════════════════════════════════'));
    console.log(chalk.cyan('  WhatsApp Blast CLI v2.0'));
    console.log(chalk.cyan('  Initializing...'));
    console.log(chalk.cyan('═══════════════════════════════════════════════════\n'));

    // Ensure all required directories exist
    logger.info('Checking directories...');
    ensureDirectories([
      config.directories.numberlist,
      config.directories.textlist,
      config.directories.report,
      config.logging.filePath
    ]);

    // Initialize WhatsApp client
    logger.info('Starting WhatsApp client...');
    const whatsappClient = new WhatsAppClient();
    await whatsappClient.initialize();

    // Wait for client to be ready
    await whatsappClient.waitForReady();

    // Create blast manager and start
    const blastManager = new BlastManager(whatsappClient);
    await blastManager.startBlast();

  } catch (error) {
    logger.error('Fatal error:', error);
    console.error(chalk.red('\n✗ Fatal error occurred:'), error.message);
    process.exit(1);
  }
}

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  console.error(chalk.red('\n✗ Uncaught Exception:'), error.message);
  process.exit(1);
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  console.error(chalk.red('\n✗ Unhandled Promise Rejection:'), reason);
  process.exit(1);
});

/**
 * Handle SIGINT (Ctrl+C)
 */
process.on('SIGINT', () => {
  logger.info('Received SIGINT, shutting down gracefully...');
  console.log(chalk.yellow('\n\nShutting down gracefully...'));
  process.exit(0);
});

/**
 * Handle SIGTERM
 */
process.on('SIGTERM', () => {
  logger.info('Received SIGTERM, shutting down gracefully...');
  console.log(chalk.yellow('\n\nShutting down gracefully...'));
  process.exit(0);
});

// Start the application
initialize();
