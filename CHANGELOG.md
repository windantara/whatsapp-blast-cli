# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-11-08

### Added
- ✨ **Message Variations System** - Advanced message variation for better spam protection
  - **Spintax Support**: {option1|option2|option3} syntax for word variations
  - **Dynamic Variables**: {date}, {time}, {datetime}, {day}, {month}, {year}, {random_number}, {random_string}
  - **Emoji Variation**: Random emoji placement (12 emoji pool)
  - **Whitespace Variation**: Subtle whitespace differences
  - **Random Suffix**: Legacy random text support
  - **5 Variation Modes**: No variation, Random suffix, Emoji, Whitespace, Full variation
- 📚 **MESSAGE_VARIATIONS_GUIDE.md** - Comprehensive guide for message variations (15KB)
- 📝 **example-spintax.txt** - Template example with spintax demonstration
- 🎨 **applyMessageVariations()** function in utils.js - Main variation processor
- 🔧 **processSpintax()** function - Spintax parser and resolver
- 🎲 **replaceDynamicVariables()** function - Dynamic variable replacer
- 😊 **addEmojiVariation()** function - Emoji variation handler
- 📏 **addWhitespaceVariation()** function - Whitespace variation handler

### Changed
- 🔄 Updated blast.js - New variation selection menu with 5 modes
- 🔄 Updated utils.js - Enhanced with 5 new variation functions
- 🔄 Modified message processing - Apply variations per-message for uniqueness
- 🔄 Enhanced confirmation screen - Show selected variation types

### Improved
- ⬆️ **Success Rate**: Expected +5-10% improvement from unique messages
- 🔐 **Spam Protection**: Each message now unique, reducing spam detection
- 🤖 **Anti-Bot Detection**: More natural, human-like message variations
- 📈 **Deliverability**: Better message delivery with unique content

### Benefits
- ✅ Avoid spam detection with unique messages
- ✅ Reduce ban risk with natural variations
- ✅ Increase engagement with dynamic content
- ✅ Professional appearance with context-aware variations
- ✅ Flexible options from no variation to full variation

## [2.0.0] - 2025-11-08

### Added
- ✨ **Modular Architecture**: Refactored code into separate modules for better maintainability
- ✨ **Retry Mechanism**: Automatic retry on failed messages (configurable via .env)
- ✨ **Progress Bar**: Real-time progress tracking with cli-progress
- ✨ **Logging System**: Winston-based logging with file output (combined.log and error.log)
- ✨ **Environment Configuration**: .env file support for easy configuration
- ✨ **Phone Validation**: Input validation for phone numbers
- ✨ **Statistics Display**: Detailed success/failure statistics after each blast
- ✨ **Setup Wizard**: Interactive setup script (`npm run setup`)
- ✨ **Error Handling**: Comprehensive error handling throughout the application
- ✨ **Graceful Shutdown**: Proper handling of SIGINT and SIGTERM signals
- ✨ **Client Info Display**: Shows connected WhatsApp account information
- ✨ **Better UX**: Improved CLI interface with colors and better formatting
- ✨ **Configuration Module**: Centralized configuration management
- ✨ **Utils Module**: Reusable utility functions
- ✨ **Enhanced Reports**: More detailed report format with statistics

### Changed
- 🔄 **Updated Dependencies**: All dependencies updated to latest versions
  - whatsapp-web.js: ^1.17.1 → ^1.23.1
  - chalk: ^4.1.2 (kept for Node 16+ compatibility)
- 🔄 **Code Structure**: Separated concerns into multiple files
  - `config.js`: Configuration management
  - `logger.js`: Logging setup
  - `utils.js`: Helper functions
  - `whatsapp.js`: WhatsApp client management
  - `blast.js`: Blast logic
  - `index.js`: Main entry point
- 🔄 **Improved Async/Await**: Better async/await handling throughout
- 🔄 **Better Error Messages**: More descriptive error messages
- 🔄 **Report Format**: Enhanced report format with more details
- 🔄 **Session Management**: Improved session handling with better path configuration

### Fixed
- 🐛 Fixed multiple phone number formatting issues
- 🐛 Fixed memory leaks in long-running processes
- 🐛 Fixed error handling for invalid phone numbers
- 🐛 Fixed file reading issues on Windows
- 🐛 Fixed session authentication issues
- 🐛 Fixed delay calculation errors

### Security
- 🔒 Added .env support to keep sensitive configuration secure
- 🔒 Improved .gitignore to prevent committing sensitive files
- 🔒 Better session file protection

### Performance
- ⚡ Optimized file reading operations
- ⚡ Reduced memory usage
- ⚡ Better resource cleanup
- ⚡ Improved puppeteer configuration for better performance

### Documentation
- 📚 Comprehensive README.md with detailed instructions
- 📚 Added CHANGELOG.md
- 📚 Added LICENSE file (MIT)
- 📚 Added inline code documentation
- 📚 Added setup instructions and troubleshooting guide

### Developer Experience
- 👨‍💻 Added npm scripts for common tasks
- 👨‍💻 Better code organization
- 👨‍💻 JSDoc comments for better IDE support
- 👨‍💻 Separated business logic from UI logic

## [1.0.0] - Original Release

### Features
- Basic WhatsApp bulk messaging
- QR Code authentication
- Text and number list management
- Simple delay configuration
- Basic sleep intervals
- Simple report generation
- Random text option for messages
- Name placeholder support

---

## Migration Guide from v1.0 to v2.0

### Breaking Changes
1. **Directory Structure**: No breaking changes to directory structure
2. **File Formats**: Number and text file formats remain the same
3. **Configuration**: New .env file for configuration (optional, has defaults)

### Steps to Upgrade
1. Backup your existing project
2. Replace all code files with v2.0 files
3. Run `npm install` to update dependencies
4. Run `npm run setup` to create new directories and .env file
5. Copy your existing numberlist and textlist files to the new directories
6. Run `npm start` to start the application

### New Features You Can Use
- Check `.env` file to customize retry attempts, delays, and logging
- Use the new progress bar to track blast progress in real-time
- Check `./logs/` directory for detailed logs
- View enhanced statistics after each blast
- Benefit from automatic retry on failed messages

### Configuration Options
All v1.0 functionality is preserved, with these new optional configurations:
- `MAX_RETRY_ATTEMPTS`: Number of retry attempts (default: 3)
- `RETRY_DELAY`: Delay between retries (default: 5000ms)
- `LOG_LEVEL`: Logging verbosity (default: info)
- `HEADLESS_MODE`: Run browser in background (default: false)

---

For more information, see [README.md](README.md)