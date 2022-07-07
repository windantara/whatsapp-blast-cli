const {
    Client,
    Location,
    List,
    Buttons,
    LocalAuth,
    MessageMedia 
} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs');
const readlineSync = require('readline-sync');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: false
    }
});


client.initialize();

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const sendMsg = async (number, msg) => {
    const correctiveNumber = number.replace(' ', '').replace('-', '').replace('-', '')
    const numberDetails = await client.getNumberId(`${parseInt(correctiveNumber.replace('+', ''))}`)

    if (numberDetails) {
        client.sendMessage(numberDetails._serialized, msg)
        console.log(chalk.green(`Message sent : ${correctiveNumber}`))
        return true
    } else {
        console.log(chalk.red(`Mobile number is not registered : ${correctiveNumber}`))
        return false
    }
}

const randomTxtOnMsg = (option, msg) => {
    return (option == 1) ? (msg+'\n\n' + Math.random().toString(16).substr(2, 8)) : msg;
}

const whatsAppBlast = async () => {
    let textListArray = [];
    let numberListArray = [];
    fs.readdirSync('./textlist/').forEach(file => {
        textListArray.push(file.replace('.txt', ''))
    });
    fs.readdirSync('./numberlist/').forEach(file => {
        numberListArray.push(file.replace('.txt', ''))
    });

    let randomTextOptionArray = ['No, keep original message', 'Yes, use random text on message']
    let randomTextOption = readlineSync.keyInSelect(randomTextOptionArray, chalk.yellow('Use the random text on the bottom message'))
    if(randomTextOption < 0) 
        whatsAppBlastReload()

    let textIndex = readlineSync.keyInSelect(textListArray, chalk.yellow('Message filename'))
    if(textIndex < 0) 
        whatsAppBlastReload()

    let numberIndex = readlineSync.keyInSelect(numberListArray, chalk.yellow('Phone number filename'))
    if(numberIndex < 0) 
        whatsAppBlastReload()

    let delay = readlineSync.question(chalk.yellow('Delay in miliseconds') + ': ')
    console.log(chalk.yellow('\n\nProcessing...\n'))
    let pathText = './textlist/' + textListArray[textIndex] + '.txt'
    let pathNumber = './numberlist/' + numberListArray[numberIndex] + '.txt'

    let dataText = fs.readFileSync(pathText, 'utf8').toString()
    dataText = randomTxtOnMsg(randomTextOption, dataText)
    let dataNumber = fs.readFileSync(pathNumber, 'utf8')
    let dataNumberInArray = dataNumber.toString().split('\n')

    const reportName = + new Date()
    let reportContent = []
    for (let i = 0; i < dataNumberInArray.length; i++) {
        const numberFormat = dataNumberInArray[i].split('|')[0]
        let textFormat

        if (dataNumberInArray[i].includes('|'))
            textFormat = dataText.replace('{name}', dataNumberInArray[i].split('|')[1])
        else
            textFormat = dataText.replace('{name}', '')

        const status = await sendMsg(numberFormat, textFormat);
        if (status) 
            reportContent.push(`${parseInt(numberFormat)} : success`)
        else 
            reportContent.push(`${parseInt(numberFormat)} : failed`)

        await sleep(delay);

        
        if (i == dataNumberInArray.length - 1) {
            //create report  
            fs.writeFile(`./report/${reportName}-${textListArray[textIndex]}-${numberListArray[numberIndex]}.txt`, reportContent.join('\r\n'), (err) => {
                if (err)
                    console.log(chalk.red(err));
                else {
                    console.log(chalk.green('\n\nBlast finished!'))
                    let runAgainArray = ['No, close.', 'Yes, run again.']
                    let runAgainOption = readlineSync.keyInSelect(runAgainArray, chalk.yellow('Run the program again'))
        
                    if (runAgainOption == 1)
                        whatsAppBlastReload()
                    else
                        process.exit()
                }
            });
        }
    }
}

const whatsAppBlastReload = () => {
    console.clear()
    whatsAppBlast()
}
client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED');
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', async () => {
    console.log(chalk.green('Client is ready!\n'));

    console.log(chalk.white.bgRed.bold('|--------------------------------------------------|'))
    console.log(chalk.white.bgRed.bold('|                                                  |'))
    console.log(chalk.white.bgRed.bold('| WhatsApp Blast CLI Version 1.0                   |'))
    console.log(chalk.white.bgWhite.bold('| https://github.com/windantara/whatsapp-blast-cli |'))
    console.log(chalk.white.bgWhite.bold('|                                                  |'))
    console.log(chalk.white.bgWhite.bold('|--------------------------------------------------|'))

    whatsAppBlast();
});

client.on('message', async msg => {
    // let message =  msg.body;
    // let chat = await msg.getChat();
    // const contact = await msg.getContact();

    // if (chat.isGroup) {
    //     if (msg.body === '!groupinfo') {
    //         msg.reply(`
    //             *Group Details*
    //             Name: ${chat.name}
    //             Description: ${chat.description}
    //             Created At: ${chat.createdAt.toString()}
    //             Created By: ${chat.owner.user}
    //             Participant count: ${chat.participants.length}
    //         `);
    //     }
    // }
    // else{
    //     if (msg.body == 'ping') {
    //         chat.sendMessage(`Hi @${contact.pushname}!`);
    //     }
    // }
});

client.on('message_create', async (msg) => {
    // Fired on all message creations, including your own
    // if (msg.fromMe) {
    //     let message =  msg.body;
    //     let chat = await msg.getChat();
    //     const contact = await msg.getContact();

    //     if (chat.isGroup) {
    //         if (msg.body === '!groupinfo') {
    //             msg.reply(`
    //                 *Group Details*
    //                 Name: ${chat.name}
    //                 Description: ${chat.description}
    //                 Created At: ${chat.createdAt.toString()}
    //                 Created By: ${chat.owner.user}
    //                 Participant count: ${chat.participants.length}
    //             `);
    //         }
    //     }
    //     else{
    //         if (msg.body == 'ping') {
    //             chat.sendMessage(`Hi @${contact.pushname}!`);
    //         }
    //     }
    // }
});

client.on('message_revoke_everyone', async (after, before) => {
    // Fired whenever a message is deleted by anyone (including you)
    // console.log('message_revoke_everyone', after); // message after it was deleted.
    // if (before) {
    //     console.log(before); // message before it was deleted.
    // }
});

client.on('message_revoke_me', async (msg) => {
    // Fired whenever a message is only deleted in your own view.
    // console.log('message_revoke_me', msg.body); // message before it was deleted.
});

client.on('message_ack', (msg, ack) => {
    /*
        == ACK VALUES ==
        ACK_ERROR: -1
        ACK_PENDING: 0
        ACK_SERVER: 1
        ACK_DEVICE: 2
        ACK_READ: 3
        ACK_PLAYED: 4
    */

    if (ack == 3) {
        // The message was read
    }
});

client.on('group_join', (notification) => {
    // User has joined or been added to the group.
    // console.log('join', notification);
    // notification.reply('User joined.');
});

client.on('group_leave', (notification) => {
    // User has left or been kicked from the group.
    // console.log('leave', notification);
    // notification.reply('User left.');
});

client.on('group_update', (notification) => {
    // Group picture, subject or description has been updated.
    // console.log('update', notification);
});

client.on('change_state', state => {
    console.log('CHANGE STATE', state);
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});