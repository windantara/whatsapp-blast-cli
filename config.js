require('dotenv').config();

/**
 * Application Configuration
 * Centralized configuration management
 */
const config = {
  whatsapp: {
    headlessMode: process.env.HEADLESS_MODE === 'true',
    sessionPath: process.env.SESSION_PATH || './.wwebjs_auth',
    defaultDelay: parseInt(process.env.DEFAULT_DELAY) || 3000,
    maxRetryAttempts: parseInt(process.env.MAX_RETRY_ATTEMPTS) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 5000,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    filePath: process.env.LOG_FILE_PATH || './logs',
  },
  
  directories: {
    numberlist: process.env.NUMBERLIST_DIR || './numberlist',
    textlist: process.env.TEXTLIST_DIR || './textlist',
    report: process.env.REPORT_DIR || './report',
  },
};

module.exports = config;
