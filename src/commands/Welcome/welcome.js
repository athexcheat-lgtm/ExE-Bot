import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} from 'discord.js';

import { successEmbed } from '../../utils/embeds.js';

export default {
    data: new SlashCommandBuilder()
        .setName('setwelcome')
        .setDescription('Setup welcome system')

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Welcome channel')
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),

    async execute(interaction, config, client) {

        const channel =
            interaction.options.getChannel('channel');

        config.welcomeChannelId = channel.id;

        const { getGuildConfigKey } = await import(
            '../../utils/database.js'
        );

        await client.db.set(
            getGuildConfigKey(interaction.guildId),
            config
        );

        await interaction.reply({
            embeds: [
                successEmbed(
                    'Welcome System Updated',
                    `Welcome channel set to ${channel}`
                )
            ],
            ephemeral: true
        });
    }
};
