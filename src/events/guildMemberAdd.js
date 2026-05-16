import {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

import { getGuildConfig } from '../../services/guildConfig.js';
import { logger } from '../../utils/logger.js';

export default {
    name: 'guildMemberAdd',

    async execute(member, client) {

        try {

            const config = await getGuildConfig(
                client,
                member.guild.id
            );

            if (!config?.welcomeChannelId) return;

            const channel = member.guild.channels.cache.get(
                config.welcomeChannelId
            );

            if (!channel) return;

            const createdTimestamp = Math.floor(
                member.user.createdTimestamp / 1000
            );

            const embed = new EmbedBuilder()
                .setColor('#6d28d9')
                .setAuthor({
                    name: `${member.user.username} joined the server`,
                    iconURL: member.user.displayAvatarURL({
                        dynamic: true
                    })
                })
                .setTitle('💀 Welcome to EXE Community')
                .setDescription(
                    `Welcome ${member} to **${member.guild.name}**\n\n` +
                    `Make sure to read the rules and enjoy your stay.`
                )
                .setThumbnail(
                    member.user.displayAvatarURL({
                        dynamic: true,
                        size: 1024
                    })
                )
                .addFields(
                    {
                        name: '👤 Member',
                        value: `${member.user.tag}`,
                        inline: true
                    },
                    {
                        name: '📊 Member Count',
                        value: `${member.guild.memberCount}`,
                        inline: true
                    },
                    {
                        name: '📅 Account Created',
                        value: `<t:${createdTimestamp}:R>`,
                        inline: true
                    }
                )
                .setImage(
                    config.welcomeBanner ||
                    'https://i.imgur.com/AfFp7pu.png'
                )
                .setFooter({
                    text: 'EXE Community',
                    iconURL: member.guild.iconURL()
                })
                .setTimestamp();

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel('Rules')
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.rulesUrl ||
                        'https://discord.gg/exe'
                    ),

                new ButtonBuilder()
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.supportUrl ||
                        'https://discord.gg/exe'
                    ),

                new ButtonBuilder()
                    .setLabel('Website')
                    .setStyle(ButtonStyle.Link)
                    .setURL(
                        config.websiteUrl ||
                        'https://google.com'
                    )
            );

            await channel.send({
                content: `👋 Welcome ${member}`,
                embeds: [embed],
                components: [row]
            });

            if (config.autoRoleId) {

                const role = member.guild.roles.cache.get(
                    config.autoRoleId
                );

                if (role) {
                    await member.roles.add(role).catch(() => {});
                }
            }

            logger.info('Member joined', {
                userId: member.user.id,
                guildId: member.guild.id
            });

        } catch (error) {

            logger.error('Welcome system error', {
                error: error.message
            });
        }
    }
};
