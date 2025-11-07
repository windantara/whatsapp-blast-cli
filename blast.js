const readlineSync = require('readline-sync');
const chalk = require('chalk');
const cliProgress = require('cli-progress');
const path = require('path');
const config = require('./config');
const logger = require('./logger');
const {
  getFilesList,
  readFileContent,
  addRandomText,
  parseNumberLine,
  replaceName,
  writeReport,
  sleep,
  formatStatistics,
  applyMessageVariations,
} = require('./utils');

class BlastManager {
  constructor(whatsappClient) {
    this.client = whatsappClient;
    this.statistics = {
      success: 0,
      failed: 0,
      skipped: 0
    };
  }

  /**
   * Main blast function
   */
  async startBlast() {
    console.clear();
    this.printHeader();

    // Check if client is ready
    if (!this.client.isReady) {
      logger.error('WhatsApp client is not ready. Please wait...');
      await this.client.waitForReady();
    }

    // Display client info
    await this.displayClientInfo();

    // Get user selections
    const selections = this.getUserSelections();
    if (!selections) {
      logger.info('Blast cancelled by user');
      console.log(chalk.yellow('\n✗ Blast cancelled. Exiting...\n'));
      await this.client.destroy();
      process.exit(0);
    }

    // Load files
    const data = this.loadFiles(selections);
    if (!data) {
      logger.error('Failed to load files');
      console.log(chalk.red('\n✗ Failed to load files. Exiting...\n'));
      await this.client.destroy();
      process.exit(1);
    }

    // Confirm before starting
    if (!this.confirmBlast(data.numbers.length, selections)) {
      logger.info('Blast cancelled by user');
      console.log(chalk.yellow('\n✗ Blast cancelled. Exiting...\n'));
      await this.client.destroy();
      process.exit(0);
    }

    // Execute blast
    await this.executeBlast(data, selections);
  }

  /**
   * Print application header
   */
  printHeader() {
    console.clear();
    console.log(chalk.white.bgRed.bold('╔════════════════════════════════════════════════╗'));
    console.log(chalk.white.bgRed.bold('║                                                ║'));
    console.log(chalk.white.bgRed.bold('║     WhatsApp Blast CLI v2.0                    ║'));
    console.log(chalk.red.bgWhite.bold('║     Enhanced & Modernized                      ║'));
    console.log(chalk.red.bgWhite.bold('║                                                ║'));
    console.log(chalk.red.bgWhite.bold('╚════════════════════════════════════════════════╝'));
    console.log('');
  }

  /**
   * Display WhatsApp client info
   */
  async displayClientInfo() {
    try {
      const info = await this.client.getClientInfo();
      if (info) {
        console.log(chalk.green(`✓ Connected as: ${info.pushname || 'Unknown'}`));
        console.log(chalk.green(`✓ Phone: ${info.wid.user}\n`));
      }
    } catch (error) {
      logger.warn('Could not retrieve client info');
    }
  }

  /**
   * Get user selections for blast configuration
   * @returns {Object|null} - User selections or null if cancelled
   */
  getUserSelections() {
    // Get available files
    const textFiles = getFilesList(config.directories.textlist);
    const numberFiles = getFilesList(config.directories.numberlist);

    if (textFiles.length === 0) {
      logger.error(`No text files found in ${config.directories.textlist}`);
      return null;
    }

    if (numberFiles.length === 0) {
      logger.error(`No number files found in ${config.directories.numberlist}`);
      return null;
    }

    // Message Variation Options
    console.log(chalk.cyan('\n═══════════════════════════════════════'));
    console.log(chalk.cyan('MESSAGE VARIATION OPTIONS'));
    console.log(chalk.cyan('═══════════════════════════════════════'));
    
    const variationOptions = [
      'No variation (original message)',
      'Add random suffix only (legacy)',
      'Add emoji variation (smile, thumbs, sparkle)',
      'Add whitespace variation',
      'Full variation (spintax + dynamic + emoji)',
    ];
    
    const variationIndex = readlineSync.keyInSelect(
      variationOptions,
      chalk.yellow('Select message variation type')
    );
    if (variationIndex < 0) return null;

    // Set variation options based on selection
    let messageVariationOptions = {
      useSpintax: true,
      useEmoji: false,
      useWhitespace: false,
      useDynamicVars: true,
      useRandomSuffix: false,
    };

    switch (variationIndex) {
      case 0: // No variation
        messageVariationOptions = {
          useSpintax: false,
          useEmoji: false,
          useWhitespace: false,
          useDynamicVars: false,
          useRandomSuffix: false,
        };
        break;
      case 1: // Random suffix only (legacy)
        messageVariationOptions.useRandomSuffix = true;
        messageVariationOptions.useSpintax = false;
        messageVariationOptions.useDynamicVars = false;
        break;
      case 2: // Emoji variation
        messageVariationOptions.useEmoji = true;
        break;
      case 3: // Whitespace variation
        messageVariationOptions.useWhitespace = true;
        break;
      case 4: // Full variation
        messageVariationOptions = {
          useSpintax: true,
          useEmoji: true,
          useWhitespace: true,
          useDynamicVars: true,
          useRandomSuffix: false,
        };
        break;
    }

    // Select text file
    const textIndex = readlineSync.keyInSelect(
      textFiles,
      chalk.yellow('Select message file')
    );
    if (textIndex < 0) return null;

    // Select number file
    const numberIndex = readlineSync.keyInSelect(
      numberFiles,
      chalk.yellow('Select phone number file')
    );
    if (numberIndex < 0) return null;

    // Get delay
    let delay = parseInt(readlineSync.question(
      chalk.yellow('Delay between messages (milliseconds): ') || config.whatsapp.defaultDelay
    ));
    if (isNaN(delay) || delay < 1000) {
      delay = config.whatsapp.defaultDelay;
      logger.warn(`Using default delay: ${delay}ms`);
    }

    // Sleep options
    const sleepOptions = ['No sleep', 'Yes, add sleep intervals'];
    const sleepIndex = readlineSync.keyInSelect(
      sleepOptions,
      chalk.yellow('Add sleep intervals during blast?')
    );
    if (sleepIndex < 0) return null;

    let sleepAfter = 0;
    let sleepDuration = 0;

    if (sleepIndex === 1) {
      sleepAfter = parseInt(readlineSync.question(
        chalk.yellow('Sleep after how many messages? ')
      ));
      sleepDuration = parseInt(readlineSync.question(
        chalk.yellow('Sleep duration (milliseconds): ')
      ));
    }

    return {
      messageVariation: messageVariationOptions,
      textFile: textFiles[textIndex],
      numberFile: numberFiles[numberIndex],
      delay,
      sleepAfter,
      sleepDuration
    };
  }

  /**
   * Load text and number files
   * @param {Object} selections - User selections
   * @returns {Object|null} - Loaded data or null if error
   */
  loadFiles(selections) {
    // Load text file
    const textPath = path.join(config.directories.textlist, `${selections.textFile}.txt`);
    let textContent = readFileContent(textPath);
    
    if (!textContent) {
      logger.error(`Failed to load text file: ${textPath}`);
      return null;
    }

    // Note: We don't apply variations here anymore
    // Variations will be applied per-message for uniqueness

    // Load number file
    const numberPath = path.join(config.directories.numberlist, `${selections.numberFile}.txt`);
    const numberContent = readFileContent(numberPath);
    
    if (!numberContent) {
      logger.error(`Failed to load number file: ${numberPath}`);
      return null;
    }

    // Parse numbers
    const numbers = numberContent
      .split('\n')
      .map(line => parseNumberLine(line))
      .filter(item => item !== null);

    if (numbers.length === 0) {
      logger.error('No valid phone numbers found in file');
      return null;
    }

    return {
      text: textContent,
      numbers
    };
  }

  /**
   * Confirm blast execution
   * @param {number} count - Number of recipients
   * @param {Object} selections - User selections
   * @returns {boolean} - User confirmation
   */
  confirmBlast(count, selections) {
    console.log('\n' + chalk.cyan('═══════════════════════════════════════'));
    console.log(chalk.cyan('BLAST CONFIGURATION:'));
    console.log(chalk.cyan('═══════════════════════════════════════'));
    console.log(chalk.white(`Message File:    ${selections.textFile}`));
    console.log(chalk.white(`Number File:     ${selections.numberFile}`));
    console.log(chalk.white(`Recipients:      ${count}`));
    console.log(chalk.white(`Delay:           ${selections.delay}ms`));
    
    // Show variation info
    const variations = [];
    if (selections.messageVariation.useSpintax) variations.push('Spintax');
    if (selections.messageVariation.useEmoji) variations.push('Emoji');
    if (selections.messageVariation.useWhitespace) variations.push('Whitespace');
    if (selections.messageVariation.useDynamicVars) variations.push('Dynamic Vars');
    if (selections.messageVariation.useRandomSuffix) variations.push('Random Suffix');
    
    const variationText = variations.length > 0 ? variations.join(', ') : 'None';
    console.log(chalk.white(`Variations:      ${variationText}`));
    
    if (selections.sleepAfter > 0) {
      console.log(chalk.white(`Sleep After:     ${selections.sleepAfter} messages`));
      console.log(chalk.white(`Sleep Duration:  ${selections.sleepDuration}ms`));
    }
    console.log(chalk.cyan('═══════════════════════════════════════\n'));

    const confirm = readlineSync.keyInYNStrict(chalk.yellow('Start blast?'));
    return confirm;
  }

  /**
   * Execute the blast
   * @param {Object} data - Message and numbers data
   * @param {Object} selections - User selections
   */
  async executeBlast(data, selections) {
    logger.info('Starting blast...');
    console.log('');

    const reportContent = [];
    const reportName = Date.now();
    let messageCount = 0;

    // Reset statistics
    this.statistics = { success: 0, failed: 0, skipped: 0 };

    // Create progress bar
    const progressBar = new cliProgress.SingleBar({
      format: chalk.cyan('{bar}') + ' | {percentage}% | {value}/{total} | Success: {success} | Failed: {failed}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true
    });

    progressBar.start(data.numbers.length, 0, {
      success: 0,
      failed: 0
    });

    // Process each number
    for (let i = 0; i < data.numbers.length; i++) {
      const item = data.numbers[i];
      
      // Replace name placeholder
      let message = replaceName(data.text, item.name);
      
      // Apply message variations (unique for each message!)
      message = applyMessageVariations(message, selections.messageVariation);

      // Send message
      const result = await this.client.sendMessage(item.number, message);

      // Update statistics and report
      if (result.success) {
        this.statistics.success++;
        reportContent.push(`${item.number} | SUCCESS | ${item.name || 'N/A'}`);
      } else {
        this.statistics.failed++;
        reportContent.push(`${item.number} | FAILED | ${item.name || 'N/A'} | ${result.error || 'Unknown error'}`);
      }

      // Update progress bar
      progressBar.update(i + 1, {
        success: this.statistics.success,
        failed: this.statistics.failed
      });

      // Delay between messages
      if (i < data.numbers.length - 1) {
        await sleep(selections.delay);
      }

      // Sleep interval
      if (selections.sleepAfter > 0) {
        messageCount++;
        if (messageCount >= selections.sleepAfter) {
          progressBar.stop();
          logger.info(`Sleeping for ${selections.sleepDuration}ms after ${selections.sleepAfter} messages...`);
          await sleep(selections.sleepDuration);
          messageCount = 0;
          progressBar.start(data.numbers.length, i + 1, {
            success: this.statistics.success,
            failed: this.statistics.failed
          });
        }
      }
    }

    progressBar.stop();

    // Save report
    const reportPath = path.join(
      config.directories.report,
      `${reportName}-${selections.textFile}-${selections.numberFile}.txt`
    );

    // Add statistics to report
    reportContent.push('\n' + '='.repeat(50));
    reportContent.push('BLAST STATISTICS');
    reportContent.push('='.repeat(50));
    reportContent.push(`Total: ${data.numbers.length}`);
    reportContent.push(`Success: ${this.statistics.success}`);
    reportContent.push(`Failed: ${this.statistics.failed}`);
    reportContent.push(`Success Rate: ${((this.statistics.success / data.numbers.length) * 100).toFixed(2)}%`);

    writeReport(reportPath, reportContent);

    // Display results
    console.log('\n' + chalk.green('✓ Blast completed!'));
    console.log(formatStatistics(this.statistics));
    console.log(chalk.cyan(`\nReport saved: ${reportPath}\n`));

    // Ask to run again
    const runAgain = readlineSync.keyInYNStrict(chalk.yellow('Run blast again?'));
    if (runAgain) {
      await this.startBlast();
    } else {
      logger.info('Exiting application...');
      await this.client.destroy();
      process.exit(0);
    }
  }
}

module.exports = BlastManager;