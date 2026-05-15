// ==========================================
// EXE COMMUNITY WELCOME SYSTEM
// ==========================================

import { getColor } from '../../config/bot.js';
import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder, MessageFlags } from 'discord.js';
import { errorEmbed } from '../../utils/embeds.js';
import { getWelcomeConfig, updateWelcomeConfig } from '../../utils/database.js';
import { formatWelcomeMessage } from '../../utils/welcome.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

export default {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Configure the EXE welcome system')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(subcommand =>
            subcommand
                .setName('setup')
                .setDescription('Setup EXE welcome system')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('Welcome channel')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true))
                .addStringOption(option =>
                    option.setName('image')
                        .setDescription('Banner image URL')
                        .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('ping')
                        .setDescription('Ping the member')
                        .setRequired(false))),

    async execute(interaction) {

        try {
            await InteractionHelper.safeDefer(interaction);
        } catch (err) {
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
            const image = options.getString('image');
            const ping = options.getBoolean('ping') ?? true;

            const existingConfig = await getWelcomeConfig(client, guild.id);

            if (existingConfig?.channelId) {
                return await InteractionHelper.safeEditReply(interaction, {
                    embeds: [
                        errorEmbed(
                            'Already Configured',
                            `Welcome system already exists in <#${existingConfig.channelId}>`
                        )
                    ],
                    flags: MessageFlags.Ephemeral
                });
            }

            try {

                await updateWelcomeConfig(client, guild.id, {
                    enabled: true,
                    channelId: channel.id,
                    welcomePing: ping,
                    welcomeImage: image || undefined,
                    welcomeMessage:
`⚡ Welcome to EXE Community!

Hey {user} welcome to **EXE Community** 🔥
You are member **#{memberCount}**

━━━━━━━━━━━━━━━━━━

🚀 **GET STARTED**
📜 Read the rules
✅ Verify & Enter
💬 Join the community
🎮 Participate in events
🎫 Open a support ticket

━━━━━━━━━━━━━━━━━━

🏆 **COMMUNITY PERKS**
🎁 Invite rewards
💎 Exclusive access
⚡ Fast support
🔥 Active community

━━━━━━━━━━━━━━━━━━

Enjoy your stay in **EXE Community**`
                });

                const embed = new EmbedBuilder()
                    .setColor('#6d28d9')
                    .setTitle('⚡ EXE Welcome System Configured')
                    .setDescription(`Welcome messages will now be sent in ${channel}`)
                    .addFields(
                        {
                            name: 'Status',
                            value: '✅ Enabled',
                            inline: true
                        },
                        {
                            name: 'Ping User',
                            value: ping ? '✅ Yes' : '❌ No',
                            inline: true
                        },
                        {
                            name: 'Style',
                            value: '🔥 EXE Community',
                            inline: true
                        }
                    )
                    .setFooter({
                        text: 'EXE Community • Welcome System'
                    })
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

                await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed]
                });

                logger.info(`[EXE Welcome] Configured in ${guild.name}`);

            } catch (error) {

                logger.error(`[EXE Welcome] Failed:`, error);

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
