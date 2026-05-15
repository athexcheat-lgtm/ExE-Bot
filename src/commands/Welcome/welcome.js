import { getColor } from '../../config/bot.js';
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    AttachmentBuilder
} from 'discord.js';

import Canvas from '@napi-rs/canvas';

import { errorEmbed } from '../../utils/embeds.js';
import { getWelcomeConfig, updateWelcomeConfig } from '../../utils/database.js';
import { formatWelcomeMessage } from '../../utils/welcome.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure the welcome system')

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)

        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Set up the welcome system')

                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Welcome channel')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )

                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('Welcome message')
                        .setRequired(true)
                )

                .addBooleanOption(option =>
                    option.setName('ping')
                        .setDescription('Ping member')
                        .setRequired(false)
                )
        ),

    async execute(interaction) {

        try {
            await InteractionHelper.safeDefer(interaction);
        } catch {
            return;
        }

        const { options, guild, client } = interaction;

        if (!interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild)) {

            return await InteractionHelper.safeEditReply(interaction, {
                embeds: [
                    errorEmbed(
                        'Missing Permissions',
                        'You need **Manage Server** permission.'
                    )
                ],
                flags: MessageFlags.Ephemeral
            });
        }

        const subcommand = options.getSubcommand();

        if (subcommand === 'setup') {

            const channel = options.getChannel('channel');
            const message = options.getString('message');
            const ping = options.getBoolean('ping') ?? true;

            try {

                await updateWelcomeConfig(client, guild.id, {
                    enabled: true,
                    channelId: channel.id,
                    welcomeMessage: message,
                    welcomePing: ping
                });

                // =========================================
                // CREATE WELCOME CARD
                // =========================================

                const canvas = Canvas.createCanvas(1200, 350);
                const ctx = canvas.getContext('2d');

                // Background
                ctx.fillStyle = '#0f0f0f';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Neon line
                ctx.fillStyle = '#39FF14';
                ctx.fillRect(0, 0, 15, canvas.height);

                // Title
                ctx.font = 'bold 50px Sans';
                ctx.fillStyle = '#ffffff';
                ctx.fillText('WELCOME TO EXE COMMUNITY', 320, 100);

                // Subtitle
                ctx.font = '30px Sans';
                ctx.fillStyle = '#39FF14';
                ctx.fillText('Toxic • Community • Gaming', 320, 150);

                // Member count
                ctx.font = '28px Sans';
                ctx.fillStyle = '#cccccc';
                ctx.fillText(`Member #${guild.memberCount}`, 320, 210);

                // Avatar
                const avatar = await Canvas.loadImage(
                    interaction.user.displayAvatarURL({
                        extension: 'png',
                        size: 512
                    })
                );

                ctx.save();

                ctx.beginPath();
                ctx.arc(170, 175, 90, 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.clip();

                ctx.drawImage(avatar, 80, 85, 180, 180);

                ctx.restore();

                // Border
                ctx.beginPath();
                ctx.lineWidth = 8;
                ctx.strokeStyle = '#39FF14';
                ctx.arc(170, 175, 95, 0, Math.PI * 2, true);
                ctx.stroke();

                const attachment = new AttachmentBuilder(
                    await canvas.encode('png'),
                    { name: 'welcome-card.png' }
                );

                // =========================================
                // EMBED
                // =========================================

                const embed = new EmbedBuilder()
                    .setColor('#39FF14')
                    .setTitle('✅ Welcome System Configured')
                    .setDescription(
`Welcome system successfully enabled in ${channel}

💀 EXE Community Style Activated`
                    )
                    .setImage('attachment://welcome-card.png')
                    .addFields(
                        {
                            name: 'Ping User',
                            value: ping ? '✅ Yes' : '❌ No',
                            inline: true
                        },
                        {
                            name: 'Status',
                            value: '✅ Enabled',
                            inline: true
                        }
                    )
                    .setFooter({
                        text: 'EXE Community • Welcome System'
                    })
                    .setTimestamp();

                await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed],
                    files: [attachment]
                });

                logger.info(`[Welcome] Configured in ${guild.name}`);

            } catch (error) {

                logger.error(`[Welcome] Failed`, error);

                await InteractionHelper.safeEditReply(interaction, {
                    embeds: [
                        errorEmbed(
                            'Setup Failed',
                            'Failed to configure welcome system.'
                        )
                    ],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    },
};
