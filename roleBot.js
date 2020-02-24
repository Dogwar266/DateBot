

/*
    Discord includes
 */


const snekfetch = require('snekfetch');
const Discord = require('discord.js');
const client = new Discord.Client({
    partials: ['MESSAGE']
});
const {prefix} = require('./config.json');
const config = require('./config');
const token = config.token;
const cheerio = require('cheerio');
const request = require('request');
client.commands = new Discord.Collection();
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();
client.login(token);
/*
    GW2 Includes

 */

// const gw2 = require('gw2-api');
// const api = new gw2.gw2();

// api.setStorage(new gw2.memStore());



/*
    CSV Includes
 */
// const csv = require('fast-csv');

/*
    Google Includes
 */

/*
    Discord Logins
 */


client.on('ready', () => {
    console.log(client.user.tag + " has logged in.");

    client.user.setActivity('Coded by Dogwar#2002');
});

let channel_id = "650567782890471436";
let message_id = "651598494141775872";

client.on("ready", (reaction, user) => {

    client.channels.get(channel_id).fetchMessage(message_id).then(m => {
        console.log("Cached reaction message.");
    }).catch(e => {
        console.error("Error loading message.");
        console.error(e);
    });

    client.on('message', message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();


        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.guildOnly && message.channel.type !== 'text') {
            return message.reply('I can\'t execute that command inside DMs!');
        }

        if (command.args && !args.length) {
            let reply = `You didn't provide any arguments, ${message.author}!`;

            if (command.usage) {
                reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
            }

            return message.channel.send(reply);
        }

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }


        try {
            command.execute(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }

        // Commands related to Reaction Roles
        if (command === 'react') {
            console.log("react works");

            const embed = new Discord.RichEmbed()
                .setColor('#da36cc')
                .setTitle('Welcome to Life!')
                .setAuthor('Life')
                .setDescription(`If you wish to have a role within the guild, please react to this message with the appropriate emoji. ${client.emojis.find(emoji => emoji.name === 'Raids')}, ${client.emojis.find(emoji => emoji.name === 'Fractals')}, ${client.emojis.find(emoji => emoji.name === 'Shardkeeper')}, ${client.emojis.find(emoji => emoji.name === 'Dungeons')} or ${client.emojis.find(emoji => emoji.name === 'Metatrain')} `)
                .setFooter('Thanks for joining Life and please ask questions whenever you like')
                .setFooter('This bot was coded by @Dogwar#2002 please contact him for enquiries');
            message.channel.send(embed);
        }
    });

});

