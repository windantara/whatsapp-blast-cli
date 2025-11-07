# 📱 WhatsApp Blast CLI v2.0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

Modern, enhanced WhatsApp bulk messaging tool with advanced features, better error handling, and comprehensive logging.

![WhatsApp Blast CLI](https://img.shields.io/badge/WhatsApp-Blast_CLI-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

## ✨ What's New in v2.0

### 🚀 Major Improvements
- **Modular Architecture**: Clean, maintainable code structure
- **Retry Mechanism**: Automatic retry on failed messages (configurable)
- **Progress Tracking**: Real-time progress bar with statistics
- **Comprehensive Logging**: Winston-based logging system with file output
- **Error Handling**: Robust error handling throughout the application
- **Environment Configuration**: .env file support for easy configuration
- **Input Validation**: Phone number validation before sending
- **Statistics**: Detailed success/failure statistics after each blast
- **Better UX**: Improved CLI interface with colors and formatting

### 🔧 Technical Enhancements
- Updated to latest dependencies
- Better async/await handling
- Graceful shutdown handling
- Memory optimization
- Better session management
- Configurable puppeteer options

## 📋 Features

- ✅ **Bulk Messaging**: Send messages to multiple contacts
- ✅ **Personalization**: Use `{name}` placeholder for personalized messages
- ✅ **Random Text**: Option to add random text to avoid spam detection
- ✅ **Delay Control**: Configurable delay between messages
- ✅ **Sleep Intervals**: Add sleep periods during blast
- ✅ **Retry Mechanism**: Automatic retry on failures
- ✅ **Progress Tracking**: Real-time progress bar
- ✅ **Detailed Reports**: Generate detailed blast reports
- ✅ **Statistics**: View success/failure statistics
- ✅ **Logging**: Comprehensive logging to files
- ✅ **Input Validation**: Validate phone numbers before sending

## 🛠️ Installation

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- Active WhatsApp account

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/windantara/whatsapp-blast-cli.git
cd whatsapp-blast-cli
```

2. **Install dependencies**
```bash
npm install
```

3. **Run setup wizard**
```bash
npm run setup
```

4. **Configure environment** (optional)
Edit the `.env` file to customize settings:
```bash
nano .env
```

## 🚀 Usage

### Basic Usage

1. **Start the application**
```bash
npm start
```

2. **Scan QR Code**
   - A QR code will appear in the terminal
   - Scan it with your WhatsApp mobile app
   - Go to: WhatsApp > Settings > Linked Devices > Link a Device

3. **Follow the prompts**
   - Select message file
   - Select number list file
   - Configure delay and other options
   - Confirm and start blast

### File Formats

#### Number List File (`./numberlist/*.txt`)
Format: `phone_number|name` (one per line)

```text
6281234567890|John Doe
6281234567891|Jane Smith
6281234567892|Bob Johnson
```

**Notes:**
- Phone number should include country code (without +)
- Name is optional (you can use just the number)
- Use `|` to separate number and name

#### Message File (`./textlist/*.txt`)
```text
Hello {name}!

This is a test message from WhatsApp Blast CLI.

You can use {name} placeholder which will be replaced
with the name from your number list.

Thank you!
```

**Notes:**
- Use `{name}` placeholder for personalization
- If no name provided in number list, `{name}` will be replaced with empty string

## ⚙️ Configuration

### Environment Variables (.env)

```bash
# WhatsApp Configuration
HEADLESS_MODE=false              # Run browser in headless mode
DEFAULT_DELAY=3000               # Default delay between messages (ms)
MAX_RETRY_ATTEMPTS=3             # Number of retry attempts for failed messages
RETRY_DELAY=5000                 # Delay between retry attempts (ms)

# Logging
LOG_LEVEL=info                   # Logging level (error, warn, info, debug)
LOG_FILE_PATH=./logs             # Path to log files

# Session
SESSION_PATH=./.wwebjs_auth      # WhatsApp session storage path

# Directories
NUMBERLIST_DIR=./numberlist      # Number list directory
TEXTLIST_DIR=./textlist          # Text list directory
REPORT_DIR=./report              # Report directory
```

### Runtime Options

During execution, you can configure:
- **Random Text**: Add random string to message (anti-spam)
- **Message File**: Select from available text files
- **Number File**: Select from available number list files
- **Delay**: Time between messages (milliseconds)
- **Sleep Intervals**: Add breaks after N messages

## 📊 Reports

After each blast, a detailed report is generated in `./report/` directory.

**Report Format:**
```text
6281234567890 | SUCCESS | John Doe
6281234567891 | FAILED | Jane Smith | Number not registered on WhatsApp
6281234567892 | SUCCESS | Bob Johnson

==================================================
BLAST STATISTICS
==================================================
Total: 3
Success: 2
Failed: 1
Success Rate: 66.67%
```

## 📝 Logs

Logs are stored in `./logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

**Log Format:**
```text
2024-01-15 10:30:45 [info]: WhatsApp client is ready!
2024-01-15 10:30:50 [info]: Message sent successfully to: 6281234567890
2024-01-15 10:30:55 [error]: Failed to send message to 6281234567891
```

## 🔒 Security & Privacy

- ⚠️ **Never share your session files** (`.wwebjs_auth` directory)
- ⚠️ **Keep your .env file private**
- ⚠️ **Don't commit sensitive data** to version control
- ⚠️ **Use at your own risk** - WhatsApp may ban accounts for spam

## 🐛 Troubleshooting

### QR Code doesn't appear
- Make sure Chrome/Chromium is installed
- Check if port 8080 is available
- Try setting `HEADLESS_MODE=false` in `.env`

### Messages fail to send
- Check internet connection
- Verify phone numbers are in correct format
- Ensure numbers are registered on WhatsApp
- Check if you're not sending too fast (increase delay)

### Authentication fails
- Delete `.wwebjs_auth` directory
- Restart the application
- Scan QR code again

### Session expires
- This is normal after long periods of inactivity
- Just scan the QR code again when prompted

## 📈 Best Practices

1. **Start Small**: Test with a small number list first
2. **Use Delays**: Don't send messages too quickly (recommended: 3-5 seconds)
3. **Add Sleep Intervals**: Take breaks during large blasts
4. **Monitor Logs**: Check logs regularly for issues
5. **Backup Sessions**: Keep backup of `.wwebjs_auth` if needed
6. **Respect Privacy**: Only send messages to people who opted in

## ⚠️ Disclaimer

This tool is for **educational and legitimate business purposes only**. 

**Important Notes:**
- Sending unsolicited messages may violate WhatsApp Terms of Service
- Your account may be banned for spam or abuse
- Always get consent before sending bulk messages
- Use responsibly and ethically
- The developer is not responsible for any misuse

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**windantara**
- GitHub: [@windantara](https://github.com/windantara)

## 🙏 Acknowledgments

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [chalk](https://github.com/chalk/chalk) - Terminal styling
- [winston](https://github.com/winstonjs/winston) - Logging library
- [cli-progress](https://github.com/npkgz/cli-progress) - Progress bar

## 📞 Support

If you have any questions or issues, please:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Search existing [GitHub Issues](https://github.com/windantara/whatsapp-blast-cli/issues)
3. Create a new issue if needed

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

Made with ❤️ by windantara
