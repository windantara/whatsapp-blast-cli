# Contributing to WhatsApp Blast CLI

First off, thank you for considering contributing to WhatsApp Blast CLI! 🎉

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge
- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

**When reporting bugs, include:**
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment:
  - OS: [e.g., Windows 10, Ubuntu 20.04, macOS 12.0]
  - Node.js version: [e.g., 16.14.0]
  - npm version: [e.g., 8.3.0]
  - Application version: [e.g., 2.0.0]

### Suggesting Enhancements

**When suggesting enhancements:**
- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List some examples of how it would work

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/AmazingFeature`
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**: `git commit -m 'Add some AmazingFeature'`
6. **Push to the branch**: `git push origin feature/AmazingFeature`
7. **Open a Pull Request**

## 🛠️ Development Setup

### Prerequisites
- Node.js >= 16.0.0
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/whatsapp-blast-cli.git
cd whatsapp-blast-cli

# Add upstream remote
git remote add upstream https://github.com/windantara/whatsapp-blast-cli.git

# Install dependencies
npm install

# Run setup
npm run setup

# Start development
npm run dev
```

### Project Structure

```
whatsapp-blast-cli/
├── config.js           # Configuration management
├── logger.js           # Logging setup
├── utils.js            # Helper functions
├── whatsapp.js         # WhatsApp client
├── blast.js            # Blast logic
├── index.js            # Main entry point
├── setup.js            # Setup wizard
└── package.json        # Dependencies
```

### Development Scripts

```bash
# Start application
npm start

# Start with auto-reload (requires nodemon)
npm run dev

# Run setup wizard
npm run setup

# Run tests (when available)
npm test
```

## 📝 Coding Guidelines

### JavaScript Style Guide

We follow standard JavaScript best practices:

#### General Rules
- Use **const** for variables that don't change
- Use **let** for variables that do change
- Never use **var**
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

#### Example

```javascript
// ✅ Good
const config = require('./config');

async function sendMessage(number, message) {
  try {
    const result = await client.sendMessage(number, message);
    logger.info(`Message sent to ${number}`);
    return result;
  } catch (error) {
    logger.error(`Failed to send message: ${error.message}`);
    throw error;
  }
}

// ❌ Bad
var config = require('./config')

function sendMessage(n, m) {
  client.sendMessage(n, m)
}
```

### Code Organization

#### Module Structure
```javascript
// 1. Imports
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

// 2. Constants
const DEFAULT_DELAY = 3000;

// 3. Helper Functions
function formatNumber(number) {
  // ...
}

// 4. Main Class/Functions
class BlastManager {
  // ...
}

// 5. Exports
module.exports = BlastManager;
```

#### Function Documentation
Use JSDoc for documenting functions:

```javascript
/**
 * Send a message to a WhatsApp number
 * @param {string} number - Phone number with country code
 * @param {string} message - Message content
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function sendMessage(number, message) {
  // implementation
}
```

### Error Handling

Always handle errors properly:

```javascript
// ✅ Good
try {
  const result = await riskyOperation();
  return { success: true, data: result };
} catch (error) {
  logger.error('Operation failed:', error);
  return { success: false, error: error.message };
}

// ❌ Bad
const result = await riskyOperation(); // No error handling
```

### Async/Await

Prefer async/await over callbacks:

```javascript
// ✅ Good
async function loadData() {
  const data = await readFile('data.txt');
  return processData(data);
}

// ❌ Bad
function loadData(callback) {
  readFile('data.txt', (err, data) => {
    if (err) return callback(err);
    processData(data, callback);
  });
}
```

### Logging

Use the logger module:

```javascript
const logger = require('./logger');

// Different log levels
logger.error('Error message');
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug message');
```

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding tests
- **chore**: Maintenance tasks

#### Examples

```bash
# Good commits
feat(blast): add retry mechanism for failed messages
fix(whatsapp): resolve session authentication issue
docs(readme): update installation instructions
refactor(utils): improve phone number validation

# Bad commits
fixed bug
update
changes
wip
```

### Commit Message Rules
- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests when relevant

## 🔄 Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Comments added for complex code
- [ ] Documentation updated (if applicable)
- [ ] No new warnings generated
- [ ] Tested on your local environment

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes locally

## Related Issues
Closes #(issue number)
```

### Review Process

1. **Automated checks** will run on your PR
2. **Maintainers** will review your code
3. **Feedback** will be provided if changes are needed
4. Once approved, your PR will be **merged**

### After Your PR is Merged

- Delete your feature branch (optional)
- Update your fork:
  ```bash
  git checkout main
  git pull upstream main
  git push origin main
  ```

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Application starts without errors
- [ ] QR code authentication works
- [ ] Message sending works
- [ ] Progress bar displays correctly
- [ ] Reports are generated
- [ ] Logs are written correctly
- [ ] Error handling works as expected
- [ ] Configuration via .env works

### Testing Environment

Create test files:

```bash
# Test number file
echo "6281234567890|Test User 1" > ./numberlist/test.txt
echo "6281234567891|Test User 2" >> ./numberlist/test.txt

# Test message file
echo "Hello {name}! This is a test." > ./textlist/test-message.txt
```

## 🏷️ Issue Labels

We use labels to organize issues:

- **bug**: Something isn't working
- **enhancement**: New feature or request
- **documentation**: Documentation improvements
- **good first issue**: Good for newcomers
- **help wanted**: Extra attention needed
- **question**: Further information requested
- **wontfix**: This will not be worked on

## 💬 Communication

- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For questions and general discussion

## 📚 Additional Resources

- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Git Commit Guidelines](https://www.conventionalcommits.org/)
- [whatsapp-web.js Documentation](https://wwebjs.dev/)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- CHANGELOG.md for significant contributions
- GitHub contributors page

---

Thank you for contributing! 🎉

**Questions?** Feel free to ask in the issues or discussions section.
