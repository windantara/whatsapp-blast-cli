const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const logger = require('./logger');
const { formatPhoneNumber, isValidPhoneNumber, sleep } = require('./utils');

class WhatsAppClient {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.retryAttempts = config.whatsapp.maxRetryAttempts;
  }

  /**
   * Initialize WhatsApp client
   */
  initialize() {
    logger.info('Initializing WhatsApp client...');

    this.client = new Client({
      authStrategy: new LocalAuth({
        dataPath: config.whatsapp.sessionPath
      }),
      puppeteer: {
        headless: config.whatsapp.headlessMode,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventHandlers();
    return this.client.initialize();
  }

  /**
   * Setup event handlers for WhatsApp client
   */
  setupEventHandlers() {
    this.client.on('qr', (qr) => {
      logger.info('QR Code received. Please scan with your phone.');
      qrcode.generate(qr, { small: true });
    });

    this.client.on('authenticated', () => {
      logger.info('Authentication successful!');
    });

    this.client.on('auth_failure', (msg) => {
      logger.error('Authentication failure:', msg);
    });

    this.client.on('ready', () => {
      this.isReady = true;
      logger.info('WhatsApp client is ready!');
    });

    this.client.on('disconnected', (reason) => {
      this.isReady = false;
      logger.warn('Client disconnected:', reason);
    });

    this.client.on('change_state', (state) => {
      logger.debug('State changed:', state);
    });
  }

  /**
   * Wait for client to be ready
   * @returns {Promise<void>}
   */
  async waitForReady() {
    while (!this.isReady) {
      await sleep(1000);
    }
  }

  /**
   * Send message to a phone number with retry mechanism
   * @param {string} number - Phone number
   * @param {string} message - Message to send
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendMessage(number, message) {
    const formattedNumber = formatPhoneNumber(number);

    // Validate phone number
    if (!isValidPhoneNumber(formattedNumber)) {
      logger.error(`Invalid phone number format: ${number}`);
      return { 
        success: false, 
        error: 'Invalid phone number format' 
      };
    }

    let lastError = null;

    // Retry mechanism
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        // Get number ID
        const numberId = await this.client.getNumberId(formattedNumber);

        if (!numberId) {
          logger.warn(`Number not registered on WhatsApp: ${number}`);
          return { 
            success: false, 
            error: 'Number not registered on WhatsApp' 
          };
        }

        // Send message
        await this.client.sendMessage(numberId._serialized, message);
        logger.info(`Message sent successfully to: ${number}`);
        
        return { success: true };

      } catch (error) {
        lastError = error;
        logger.warn(`Attempt ${attempt}/${this.retryAttempts} failed for ${number}: ${error.message}`);

        if (attempt < this.retryAttempts) {
          logger.info(`Retrying in ${config.whatsapp.retryDelay / 1000} seconds...`);
          await sleep(config.whatsapp.retryDelay);
        }
      }
    }

    // All attempts failed
    logger.error(`Failed to send message to ${number} after ${this.retryAttempts} attempts`);
    return { 
      success: false, 
      error: lastError ? lastError.message : 'Unknown error' 
    };
  }

  /**
   * Get client info
   * @returns {Promise<Object>}
   */
  async getClientInfo() {
    try {
      const info = await this.client.info;
      return info;
    } catch (error) {
      logger.error('Error getting client info:', error);
      return null;
    }
  }

  /**
   * Destroy client
   */
  async destroy() {
    if (this.client) {
      logger.info('Destroying WhatsApp client...');
      await this.client.destroy();
      this.isReady = false;
    }
  }
}

module.exports = WhatsAppClient;
