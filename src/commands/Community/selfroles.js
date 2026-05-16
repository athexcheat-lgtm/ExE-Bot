import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} from 'discord.js';

export default {

    data: new SlashCommandBuilder()
        .setName('selfroles')
        .setDescription('Send the EXE Community self-role panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        // ==========================================
        // EMBED
        // ==========================================

        const embed = new EmbedBuilder()
            .setColor('#39FF14')
            .setTitle('🎭 EXE Community Self Roles')
            .setDescription(`
Choose your roles and customize your profile ⚡

🎮 Game Roles
🔞 Age Roles
🌍 Country Roles
❤️ Status Roles

Use the menus below to select your roles.
`)
            .setFooter({
                text: 'EXE Community • Self Roles'
            });

        // ==========================================
        // GAME MENU
        // ==========================================

        const gamesMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_games')
            .setPlaceholder('🎮 Select your games')
            .setMinValues(0)
            .setMaxValues(5)
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('FiveM')
                    .setValue('fivem')
                    .setEmoji('🚓'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('CS2')
                    .setValue('cs2')
                    .setEmoji('🔫'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Valorant')
                    .setValue('valorant')
                    .setEmoji('🎯'),

                new StringSelectMenuOptionBuilder()
                    .setLabel('Free Fire')
                    .setValue('freefire')
                    .setEmoji('🔥')
            );

        // ==========================================
        // AGE MENU
        // ==========================================

        const ageMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_age')
            .setPlaceholder('🔞 Select your age')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                {
                    label: '-18',
                    value: 'minus18',
                    emoji: '🧒'
                },
                {
                    label: '+18',
                    value: 'plus18',
                    emoji: '🧑'
                }
            );

        // ==========================================
        // COUNTRY MENU
        // ==========================================

        const countryMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_country')
            .setPlaceholder('🌍 Select your country')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                {
                    label: 'Algeria',
                    value: 'dz',
                    emoji: '🇩🇿'
                },
                {
                    label: 'Brazil',
                    value: 'br',
                    emoji: '🇧🇷'
                },
                {
                    label: 'Morocco',
                    value: 'ma',
                    emoji: '🇲🇦'
                },
                {
                    label: 'Saudi Arabia',
                    value: 'sa',
                    emoji: '🇸🇦'
                },
                {
                    label: 'Tunisia',
                    value: 'tn',
                    emoji: '🇹🇳'
                },
                {
                    label: 'USA',
                    value: 'us',
                    emoji: '🇺🇸'
                }
            );

        // ==========================================
        // STATUS MENU
        // ==========================================

        const statusMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_status')
            .setPlaceholder('❤️ Select your status')
            .setMinValues(1)
            .setMaxValues(1)
            .addOptions(
                {
                    label: 'Single',
                    value: 'single',
                    emoji: '💔'
                },
                {
                    label: 'In Couple',
                    value: 'couple',
                    emoji: '❤️'
                },
                {
                    label: 'Looking',
                    value: 'looking',
                    emoji: '👀'
                }
            );

        // ==========================================
        // ACTION ROWS
        // ==========================================

        const rows = [
            new ActionRowBuilder().addComponents(gamesMenu),
            new ActionRowBuilder().addComponents(ageMenu),
            new ActionRowBuilder().addComponents(countryMenu),
            new ActionRowBuilder().addComponents(statusMenu)
        ];

        // ==========================================
        // SEND PANEL
        // ==========================================

        await interaction.channel.send({
            embeds: [embed],
            components: rows
        });

        await interaction.reply({
            content: '✅ Self-role panel sent successfully.',
            ephemeral: true
        });
    }
};
