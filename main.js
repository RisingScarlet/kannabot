const Discord = require("discord.js");
const KannaGifs = require("./gif/KannaGifs.js");
const DiscordKey = require("./keys/DiscordKey.js");
const CommandParser = require("./command/CommandParser");

CommandParser.setPrefix('~');

const client = new Discord.Client();
client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
    let command = CommandParser.parseCommand(message.content);

    //if the message is not a command and the
    //message author is a bot, don't process
    if (command === CommandParser.NO_COMMAND || message.author.bot) {
        return;
    }
    if (message.author.bot) return;
    if (message.content.indexOf('~') !== 0) return;

    const splitCommand = command.split(' ');
    const commandName = splitCommand[0];

    switch (commandName) {
        case 'gifs':
            KannaGifs.fetchAvailableGifs().then(files => message.channel.send(files.join(', ')));
            break;

        case 'time':
            let d = new Date()
            //Time Zones 
            //Early to late
            //https://kevinnovak.github.io/Time-Zone-Picker/ and https://www.worldtimezone.com/wtz008.php
            let pst = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'America/Los_Angeles' }) //1-early
            let cst = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'America/Chicago' }) //2
            let est = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'America/New_York' })  //3 
            let utcm3 = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'America/Argentina/Buenos_Aires' }) //4
            let bst = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'Europe/London' })//6 |+ bst + ' BST' + '\n'| ← has daylight savings
            let awst = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'Australia/Perth' }) //7
            let jst = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'Asia/Tokyo' }) //8
            let aest = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'Australia/Brisbane' }) //9
            let aedt = d.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit', second: '2-digit', timeZone: 'Australia/Sydney' }) //10-late
            //5 ↓
            let utcHours = d.getUTCHours()
            let isAfternoon = utcHours > 12
            utcHours = (isAfternoon ? utcHours - 12 : utcHours)
            let formattedUTCHours = utcHours < 10 ? '0' + utcHours : utcHours
            let utcMins = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : d.getUTCMinutes()
            let utcSecs = d.getUTCSeconds() < 10 ? '0' + d.getUTCSeconds() : d.getUTCSeconds()
            let gmt = '' + formattedUTCHours + ':' + utcMins + ':' + utcSecs + ' ' + (isAfternoon ? 'PM' : 'AM')
            message.channel.send('The current time is: ' + '\n' + pst + ' PST' + '\n' + cst + ' CST' + '\n' + est + ' EST' + '\n' + utcm3 + ' UTC -3' + '\n' + gmt + ' UTC' + '\n' + awst + ' AWST' + '\n' + jst + ' JST' + '\n' + aest + ' AEST' + '\n' + aedt + ' AEDT' + '\n');
            break;
        case 'welcome':
        case 'sell':
        case 'buy':
        case 'rice':

            KannaGifs.verifyHasGif(commandName).then(() => {
                const gifMetadata = KannaGifs.getGifMetadataName(commandName);
                let fullMessage = gifMetadata.message;
                let item = splitCommand.length > 1 ? splitCommand[1] : ''
                fullMessage = fullMessage.replace('%ITEM%', item)
                message.channel.send(fullMessage, {
                    files:
                      [
                        {
                          attachment: gifMetadata.file,
                          name: gifMetadata.name
                        }
                      ]
                })
            })
            break;
        case 'help':
            var nonGifCommands = "Files with 'NO' in the beginning do not currently work \ntime, buy, sell, ";
            KannaGifs.fetchAvailableGifs().then(files => message.channel.send("List of valid commands: \n" + nonGifCommands + files.join(', ')));
            break;
        case 'wakeup':
        case 'bughunt':
        case 'attack':    
        case 'sleepy':
        case 'kill':
        case 'lost':
        case 'oyasumi':
        case 'feed':
        case 'cry':
        case 'raid':
        case 'surprise':
        case 'back':
        case 'hug':
        case 'pillow':
            const taggedUser = message.mentions.users.first();
            KannaGifs.verifyHasGif(commandName).then(() => {
                const gifMetadata = KannaGifs.getGifMetadataName(commandName);
                let fullMessage = gifMetadata.message;
                if (gifMetadata.isMentionUser) {
                    fullMessage = '<@' + message.author.id + '> ' + fullMessage;
                }
                if (!!taggedUser) {
                    fullMessage = fullMessage + ' ' + '<@' + taggedUser.id + '> '
                } else if (splitCommand.length > 1) {
                    fullMessage = fullMessage + ' ' + splitCommand[1]
                    // fullMessage = fullMessage + ' ' + '<@' + splitCommand[1] + '> '
                }
                message.channel.send(fullMessage, {
                    files:
                      [
                        {
                          attachment: gifMetadata.file,
                          name: gifMetadata.name
                        }
                      ]
                })
                    .catch(e => message.channel.send('s-s-sorrymasen. Something went horribly wrong with ' + gifName + ' ;A;'));
            })
            .catch(e => message.channel.send("I don't have that gif b-b-b-baka >///<"));
            break;

            default:
            message.channel.send(commandName + ' is not a valid command. Type ~help to find available commands. If you see a command not available but is on the list, feel free to give me a suggestion.')
            break;
    }
});
  
// Log our bot in using the token from https://discordapp.com/developers/applications/me
client.login(DiscordKey.key);
