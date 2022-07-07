const { Client, Location, List, Buttons, LocalAuth} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const chalk = require('chalk');
const fs = require('fs');
const readlineSync = require('readline-sync');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: false }
});


client.initialize();

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const sendMsg = async (number, msg) => {
    const correctiveNumber = number.replace(' ', '').replace('-', '').replace('-', '')
    
    const numberDetails = await client.getNumberId(correctiveNumber.substring(1)+'@c.us');
    
    if (numberDetails) {
        client.sendMessage(numberDetails._serialized, msg);
        console.log(chalk.green(`Message sent : ${correctiveNumber}`));
    } else {
        console.log(chalk.red(`Mobile number is not registered : ${correctiveNumber}`));
    }
}

const randomTxtOnMsg = (option, msg) => {
    if(option == 1)
        return msg + '\n\n' + Math.random().toString(16).substr(2, 8);
    else
        return msg
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

    let randomTextOptionArray = ['No, keep original message', 'Yes, use random text on message']
    let randomTextOption = readlineSync.keyInSelect(randomTextOptionArray, chalk.yellow('Use the random text on the bottom message'))
    let text = readlineSync.question(chalk.yellow('Message filename                                   ') + ': ')
    let numberList = readlineSync.question(chalk.yellow('Phone number filename                              ') + ': ')
    let delay = readlineSync.question(chalk.yellow('Delay in miliseconds                               ') + ': ')
    let pathText = './textlist/'+text+'.txt'
    let pathNumber = './numberlist/'+numberList+'.txt'

    if(fs.existsSync(pathText) == false){
        console.log(chalk.red('\nMessage file not found, make sure you have the file in the textlist folder'))
        process.exit()
    }

    if(fs.existsSync(pathNumber) == false){
        console.log(chalk.red('\nPhone number file not found, make sure you have the file in the numberlist folder'))
        process.exit()
    }

    let dataText = fs.readFileSync(pathText, 'utf8').toString()
    dataText = randomTxtOnMsg(randomTextOption, dataText)
    let dataNumber = fs.readFileSync(pathNumber, 'utf8')
    let dataNumberInArray = dataNumber.toString().split('\n')
    
    for(let i = 0; i < dataNumberInArray.length; i++){
        if(dataNumberInArray[i].includes('|')){
            let numberFormat = dataNumberInArray[i].split('|')
            let textFormat = dataText.replace('{name}', numberFormat[1])
            sendMsg(numberFormat[0], textFormat);
        }
        else{
            let textFormat = dataText.replace('{name}', '')
            sendMsg(dataNumberInArray[i], textFormat);
        }
        await sleep(delay);

        if(i == dataNumberInArray.length-1){
            console.log(chalk.green('\n\nBlast finished!'))
        }
    }

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

client.on('message_create', async(msg) => {
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

    if(ack == 3) {
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
    console.log('CHANGE STATE', state );
});

client.on('disconnected', (reason) => {
    console.log('Client was logged out', reason);
});