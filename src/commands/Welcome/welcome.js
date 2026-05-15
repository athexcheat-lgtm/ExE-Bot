const {
    EmbedBuilder
} = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',

    async execute(member) {

        // Welcome channel ID
        const channel = member.guild.channels.cache.get('CHANNEL_ID');

        if (!channel) return;

        // Welcome Embed
        const embed = new EmbedBuilder()
            .setColor('#5865F2')
            .setTitle('👋 Welcome!')
            .setDescription(
`Hey ${member},

Welcome to **${member.guild.name}** 🎉

You are member **#${member.guild.memberCount}**

Make sure to:
📜 Read the rules
💬 Chat with the community
🎮 Have fun

Enjoy your stay ❤️`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Send message
        channel.send({
            content: `Welcome ${member}!`,
            embeds: [embed]
        });
    },
};
