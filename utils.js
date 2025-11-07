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
 * Add random text to message (LEGACY - kept for compatibility)
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
 * Process spintax in message
 * Supports syntax: {option1|option2|option3}
 * @param {string} text - Text with spintax
 * @returns {string} - Text with spintax resolved
 */
const processSpintax = (text) => {
  return text.replace(/\{([^{}]+)\}/g, (match, group) => {
    const options = group.split('|');
    return options[Math.floor(Math.random() * options.length)];
  });
};

/**
 * Add emoji variation to message
 * @param {string} message - Original message
 * @param {boolean} enabled - Whether to add emoji
 * @returns {string} - Message with or without emoji
 */
const addEmojiVariation = (message, enabled = false) => {
  if (!enabled) return message;
  
  const emojis = [
    '😊', '👍', '✨', '🙏', '💪', '🎉', 
    '✅', '👌', '🌟', '💯', '🔥', '❤️'
  ];
  
  const selectedEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  
  // Randomly place emoji at start or end
  return Math.random() > 0.5 
    ? `${selectedEmoji} ${message}` 
    : `${message} ${selectedEmoji}`;
};

/**
 * Add whitespace variation to message
 * @param {string} message - Original message
 * @param {boolean} enabled - Whether to add variation
 * @returns {string} - Message with whitespace variation
 */
const addWhitespaceVariation = (message, enabled = false) => {
  if (!enabled) return message;
  
  const variations = [
    message,
    `${message}\n`,
    `${message}\n\n`,
    ` ${message}`,
  ];
  
  return variations[Math.floor(Math.random() * variations.length)];
};

/**
 * Replace dynamic variables in message
 * Supports: {date}, {time}, {datetime}, {random_number}, {random_string}
 * @param {string} message - Message with variables
 * @returns {string} - Message with variables replaced
 */
const replaceDynamicVariables = (message) => {
  const now = new Date();
  
  const variables = {
    '{date}': now.toLocaleDateString('id-ID'),
    '{time}': now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    '{datetime}': now.toLocaleString('id-ID'),
    '{day}': now.toLocaleDateString('id-ID', { weekday: 'long' }),
    '{month}': now.toLocaleDateString('id-ID', { month: 'long' }),
    '{year}': now.getFullYear().toString(),
    '{random_number}': Math.floor(Math.random() * 1000).toString(),
    '{random_string}': Math.random().toString(36).substring(2, 8).toUpperCase(),
  };
  
  let result = message;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, 'g'), value);
  });
  
  return result;
};

/**
 * Apply message variations
 * @param {string} message - Original message
 * @param {Object} options - Variation options
 * @returns {string} - Message with variations applied
 */
const applyMessageVariations = (message, options = {}) => {
  const {
    useSpintax = true,
    useEmoji = false,
    useWhitespace = false,
    useDynamicVars = true,
    useRandomSuffix = false,
  } = options;
  
  let result = message;
  
  // 1. Process spintax first
  if (useSpintax) {
    result = processSpintax(result);
  }
  
  // 2. Replace dynamic variables
  if (useDynamicVars) {
    result = replaceDynamicVariables(result);
  }
  
  // 3. Add emoji variation
  if (useEmoji) {
    result = addEmojiVariation(result, true);
  }
  
  // 4. Add whitespace variation
  if (useWhitespace) {
    result = addWhitespaceVariation(result, true);
  }
  
  // 5. Add random suffix (legacy support)
  if (useRandomSuffix) {
    result = `${result}\n\n${Math.random().toString(36).substring(2, 10)}`;
  }
  
  return result;
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
  processSpintax,
  addEmojiVariation,
  addWhitespaceVariation,
  replaceDynamicVariables,
  applyMessageVariations,
};
