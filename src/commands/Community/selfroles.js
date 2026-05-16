import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

export default {

    data: new SlashCommandBuilder()
        .setName('selfroles')
        .setDescription('Send EXE self roles panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('🎭 EXE Community Roles')
            .setDescription(`
Customize your EXE profile by selecting your roles.

Browse categories below and choose what represents you ⚡

**🔞 Age** • Select your age group  
**❤️ Relationship** • Share your status  
**🎮 Games** • Select your favorite games  
**🌍 Country** • Choose your country

━━━━━━━━━━━━━━━━━━
Click a category button below to continue.
            `)
            .setFooter({
                text: 'EXE Community • Self Roles'
            });

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('open_age_roles')
                    .setLabel('Age')
                    .setEmoji('🔞')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId('open_status_roles')
                    .setLabel('Relationship')
                    .setEmoji('❤️')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId('open_games_roles')
                    .setLabel('Games')
                    .setEmoji('🎮')
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId('open_country_roles')
                    .setLabel('Country')
                    .setEmoji('🌍')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
}; 
