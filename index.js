const Discord = require('discord.js');

const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION','EMBED_FIELD_VALUE']});

const prefix = '.' ;

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    client.commands.set(command.name, command);
}


client.once('ready', () => {
    console.log('ctd est en ligne');
    client.user.setActivity('CTD', { type: "PLAYING" }).catch(console.error);
});

client.on('message', message => {
    if(!message.content.startsWith(prefix) || message.author.bot) return;

   const args = message.content.slice(prefix.length).split(/ +/);
   const command = args.shift().toLowerCase();  

          if (command === 'ping'){
       client.commands.get('ping').execute(message, args);
   } else if (command == 'help'){
       client.commands.get('help').execute(message, args, Discord);
   } else if (command == 'suggestion'){
       client.commands.get('suggestion').execute(message, args, Discord);
   }
});


client.login('ODc3MTIzMjIwOTQ2NDMyMDMw.YRuCqA.7lP4MBOi9wWYksdS1SBQdUnACcE');

