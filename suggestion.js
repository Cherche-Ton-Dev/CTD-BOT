const {MessageEmbed} = require('discord.js');
module.exports = {
    name: 'suggest',
    aliases: ['suggestions', 'suggestion'],
    permissions: [],
    description: 'suggest smth to make the server better',
    execute(message, args, cmd, client, discord){
        const channel = message.guild.channels.cache.find(c => c.name === 'the name of the suggestion channel you want');
        if(!channel) return message.channel.send('( the channel name ) channel does not exist')

        let messageArgs = args.join(' ');
        const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(messageArgs);

        channel.send(embed).then((msg) =>{
            msg.react('👍');
            msg.react('👎');
            message.delete();
        }).catch((err)=>{
            throw err;
        });
    }
}