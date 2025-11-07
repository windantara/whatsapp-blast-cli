const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/**
 * Sleep utility function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Format phone number by removing spaces and dashes
 * @param {string} number - Phone number to format
 * @returns {string} - Formatted phone number
 */
const formatPhoneNumber = (number) => {
  return number
    .replace(/\s/g, '')
    .replace(/-/g, '')
    .replace(/\+/g, '');
};

/**
 * Validate phone number format
 * @param {string} number - Phone number to validate
 * @returns {boolean}
 */
const isValidPhoneNumber = (number) => {
  const formatted = formatPhoneNumber(number);
  return /^\d{10,15}$/.test(formatted);
};

/**
 * Add random text to message
 * @param {boolean} useRandom - Whether to add random text
 * @param {string} msg - Original message
 * @returns {string} - Message with or without random text
 */
const addRandomText = (useRandom, msg) => {
  return useRandom 
    ? `${msg}\n\n${Math.random().toString(36).substring(2, 10)}` 
    : msg;
};

/**
 * Get list of files from directory
 * @param {string} directory - Directory path
 * @param {string} extension - File extension (default: '.txt')
 * @returns {string[]} - Array of filenames without extension
 */
const getFilesList = (directory, extension = '.txt') => {
  try {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
      logger.warn(`Directory created: ${directory}`);
      return [];
    }

    return fs.readdirSync(directory)
      .filter(file => file.endsWith(extension))
      .map(file => file.replace(extension, ''));
  } catch (error) {
    logger.error(`Error reading directory ${directory}:`, error);
    return [];
  }
};

/**
 * Read file content
 * @param {string} filePath - Path to file
 * @returns {string|null} - File content or null if error
 */
const readFileContent = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    logger.error(`Error reading file ${filePath}:`, error);
    return null;
  }
};

/**
 * Write report file
 * @param {string} filePath - Path to report file
 * @param {string[]} content - Array of content lines
 * @returns {boolean} - Success status
 */
const writeReport = (filePath, content) => {
  try {
    const reportDir = path.dirname(filePath);
    if (!fs.existsSync(reportDir)) {
      fs.mkdirSync(reportDir, { recursive: true });
    }

    fs.writeFileSync(filePath, content.join('\r\n'));
    logger.info(`Report saved: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`Error writing report ${filePath}:`, error);
    return false;
  }
};

/**
 * Ensure directories exist
 * @param {string[]} directories - Array of directory paths
 */
const ensureDirectories = (directories) => {
  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      logger.info(`Directory created: ${dir}`);
    }
  });
};

/**
 * Parse phone number line (supports format: number|name)
 * @param {string} line - Line from number file
 * @returns {{number: string, name: string|null}}
 */
const parseNumberLine = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const parts = trimmed.split('|');
  return {
    number: parts[0].trim(),
    name: parts[1] ? parts[1].trim() : null
  };
};

/**
 * Replace name placeholder in message
 * @param {string} message - Message template
 * @param {string|null} name - Name to replace
 * @returns {string} - Message with replaced name
 */
const replaceName = (message, name) => {
  return message.replace(/{name}/g, name || '');
};

/**
 * Format statistics
 * @param {Object} stats - Statistics object
 * @returns {string} - Formatted statistics
 */
const formatStatistics = (stats) => {
  const total = stats.success + stats.failed + stats.skipped;
  const successRate = total > 0 ? ((stats.success / total) * 100).toFixed(2) : 0;

  return `
╔════════════════════════════════════╗
║        BLAST STATISTICS           ║
╠════════════════════════════════════╣
║ Total Numbers: ${total.toString().padEnd(19)}║
║ Successful:    ${stats.success.toString().padEnd(19)}║
║ Failed:        ${stats.failed.toString().padEnd(19)}║
║ Skipped:       ${stats.skipped.toString().padEnd(19)}║
║ Success Rate:  ${successRate}%${' '.repeat(15 - successRate.toString().length)}║
╚════════════════════════════════════╝
  `.trim();
};

module.exports = {
  sleep,
  formatPhoneNumber,
  isValidPhoneNumber,
  addRandomText,
  getFilesList,
  readFileContent,
  writeReport,
  ensureDirectories,
  parseNumberLine,
  replaceName,
  formatStatistics,
};
