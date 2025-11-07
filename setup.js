#!/usr/bin/env node

/**
 * Setup wizard for WhatsApp Blast CLI
 * Creates necessary directories and example files
 */

const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');
const chalk = require('chalk');

console.clear();
console.log(chalk.cyan('═══════════════════════════════════════════════════'));
console.log(chalk.cyan('  WhatsApp Blast CLI v2.0 - Setup Wizard'));
console.log(chalk.cyan('═══════════════════════════════════════════════════\n'));

const directories = [
  './numberlist',
  './textlist',
  './report',
  './logs',
  './.wwebjs_auth'
];

const exampleFiles = {
  './numberlist/example.txt': `6281234567890|John Doe
6281234567891|Jane Smith
6281234567892|Bob Johnson`,
  
  './textlist/example.txt': `Hello {name}!

This is an example message from WhatsApp Blast CLI v2.0.

Thank you!`,
  
  './report/README.txt': `This folder contains blast reports.
Each report shows the status of each message sent.`,
  
  '.env': `# WhatsApp Configuration
HEADLESS_MODE=false
DEFAULT_DELAY=3000
MAX_RETRY_ATTEMPTS=3
RETRY_DELAY=5000

# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# Session
SESSION_PATH=./.wwebjs_auth

# Directories
NUMBERLIST_DIR=./numberlist
TEXTLIST_DIR=./textlist
REPORT_DIR=./report`
};

console.log(chalk.yellow('This wizard will set up your WhatsApp Blast CLI environment.\n'));

// Create directories
console.log(chalk.cyan('Creating directories...'));
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(chalk.green(`✓ Created: ${dir}`));
  } else {
    console.log(chalk.gray(`⊙ Already exists: ${dir}`));
  }
});

console.log('');

// Create example files
const createExamples = readlineSync.keyInYNStrict(
  chalk.yellow('Create example files?')
);

if (createExamples) {
  console.log(chalk.cyan('\nCreating example files...'));
  
  Object.entries(exampleFiles).forEach(([filePath, content]) => {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, content);
      console.log(chalk.green(`✓ Created: ${filePath}`));
    } else {
      console.log(chalk.gray(`⊙ Already exists: ${filePath}`));
    }
  });
}

// Create .gitignore if it doesn't exist
const gitignorePath = './.gitignore';
const gitignoreContent = `/node_modules
/.wwebjs_auth
/numberlist/*
!/numberlist/example.txt
/textlist/*
!/textlist/example.txt
/report/*
!/report/README.txt
/logs/*
.env
*.log`;

if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log(chalk.green(`\n✓ Created: ${gitignorePath}`));
}

console.log(chalk.green('\n✓ Setup completed successfully!\n'));
console.log(chalk.cyan('Next steps:'));
console.log(chalk.white('1. Install dependencies: npm install'));
console.log(chalk.white('2. Review and edit .env file if needed'));
console.log(chalk.white('3. Add your message files to ./textlist/'));
console.log(chalk.white('4. Add your phone number files to ./numberlist/'));
console.log(chalk.white('5. Run the application: npm start\n'));

console.log(chalk.yellow('Note: Number format in numberlist files:'));
console.log(chalk.white('  6281234567890|John Doe'));
console.log(chalk.white('  6281234567891|Jane Smith\n'));

console.log(chalk.yellow('You can use {name} placeholder in message files.\n'));
