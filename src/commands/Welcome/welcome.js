// ==========================================
// EXE COMMUNITY TOXIC WELCOME SYSTEM
// ==========================================

import { getColor } from '../../config/bot.js';
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    MessageFlags,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} from 'discord.js';

import { errorEmbed } from '../../utils/embeds.js';
import { getWelcomeConfig, updateWelcomeConfig } from '../../utils/database.js';
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
                .setDescription('Setup EXE toxic welcome system')

                .addChannelOption(option =>
                    option
                        .setName('channel')
                        .setDescription('Welcome channel')
                        .addChannelTypes(ChannelType.GuildText)
                        .setRequired(true)
                )

                .addStringOption(option =>
                    option
                        .setName('image')
                        .setDescription('Banner image URL')
                        .setRequired(false)
                )

                .addBooleanOption(option =>
                    option
                        .setName('ping')
                        .setDescription('Ping the member')
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
`💀 Welcome to EXE Community

{user} just entered the EXE zone ⚡

👾 Member #{memberCount}

━━━━━━━━━━━━━━━━━━

📜 Read the Rules
Get familiar with our community guidelines.

🌐 Visit Website
Explore EXE Community and connect with the platform.

🧬 Create Your Profile
Customize your identity and social links.

🆘 Need Help?
Open a support ticket and our staff team will assist you.

━━━━━━━━━━━━━━━━━━

💀 EXE Community • execommunity.xyz`
                });

                // =========================
                // BUTTONS
                // =========================

                const row = new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()
                            .setLabel('Rules')
                            .setStyle(ButtonStyle.Secondary)
                            .setURL('https://discord.com/channels/YOURSERVER/RULESCHANNEL'),

                        new ButtonBuilder()
                            .setLabel('Website')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://execommunity.xyz'),

                        new ButtonBuilder()
                            .setLabel('Create Profile')
                            .setStyle(ButtonStyle.Link)
                            .setURL('https://execommunity.xyz/profile'),

                        new ButtonBuilder()
                            .setLabel('Support')
                            .setStyle(ButtonStyle.Secondary)
                            .setURL('https://discord.com/channels/YOURSERVER/TICKETCHANNEL')
                    );

                // =========================
                // EMBED
                // =========================

                const embed = new EmbedBuilder()
                    .setColor('#39FF14')
                    .setTitle('💀 EXE Community')
                    .setDescription(
`⚡ Toxic welcome system successfully configured.

Welcome messages will now be sent in ${channel}`
                    )
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
                            value: '☣️ Toxic EXE',
                            inline: true
                        }
                    )
                    .setFooter({
                        text: 'EXE Community • Toxic System'
                    })
                    .setTimestamp();

                if (image) {
                    embed.setImage(image);
                }

                await InteractionHelper.safeEditReply(interaction, {
                    embeds: [embed],
                    components: [row]
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
