import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} from 'discord.js';

export default {

    data: new SlashCommandBuilder()
        .setName('selfroles')
        .setDescription('Send self role panel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor('#39FF14')
            .setTitle('🎭 EXE Community Self Roles')
            .setDescription(`
Choose your roles ⚡

🎮 Games
🔞 Age
🌍 Country
❤️ Status
            `);

        // =====================================
        // GAMES
        // =====================================

        const gamesMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_games')
            .setPlaceholder('🎮 Select your games')
            .addOptions([
                {
                    label: 'FiveM',
                    value: 'fivem',
                    emoji: '🚓'
                },
                {
                    label: 'CS2',
                    value: 'cs2',
                    emoji: '🔫'
                },
                {
                    label: 'Valorant',
                    value: 'valorant',
                    emoji: '🎯'
                }
            ]);

        // =====================================
        // AGE
        // =====================================

        const ageMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_age')
            .setPlaceholder('🔞 Select your age')
            .addOptions([
                {
                    label: '-18',
                    value: 'minus18'
                },
                {
                    label: '+18',
                    value: 'plus18'
                }
            ]);

        // =====================================
        // COUNTRY
        // =====================================

        const countryMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_country')
            .setPlaceholder('🌍 Select country')
            .addOptions([
                {
                    label: 'Tunisia',
                    value: 'tn',
                    emoji: '🇹🇳'
                },
                {
                    label: 'Algeria',
                    value: 'dz',
                    emoji: '🇩🇿'
                },
                {
                    label: 'Brazil',
                    value: 'br',
                    emoji: '🇧🇷'
                }
            ]);

        // =====================================
        // STATUS
        // =====================================

        const statusMenu = new StringSelectMenuBuilder()
            .setCustomId('roles_status')
            .setPlaceholder('❤️ Select status')
            .addOptions([
                {
                    label: 'Single',
                    value: 'single'
                },
                {
                    label: 'In Couple',
                    value: 'couple'
                }
            ]);

        // =====================================
        // ROWS
        // =====================================

        const row1 = new ActionRowBuilder()
            .addComponents(gamesMenu);

        const row2 = new ActionRowBuilder()
            .addComponents(ageMenu);

        const row3 = new ActionRowBuilder()
            .addComponents(countryMenu);

        const row4 = new ActionRowBuilder()
            .addComponents(statusMenu);

        // =====================================
        // SEND
        // =====================================

        await interaction.reply({
            embeds: [embed],
            components: [row1, row2, row3, row4]
        });
    }
};
