require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

// Set URLs for Logo and Background
const LOGO_URL = 'https://media.discordapp.net/attachments/1339914433983414344/1339936441400037457/GOpDm8Y.jpg?ex=67b0888e&is=67af370e&hm=b25702213d01e74958fa72ac7bd29cd7a1e53cc4ad5e64289d621f8de86ba5ac&=&format=webp';
const BACKGROUND_URL = 'https://media.discordapp.net/attachments/1339914433983414344/1339936441131728908/2tOOoY6.jpg?ex=67b0888e&is=67af370e&hm=88054cdd60f83f265ba1f8975d713715d7344400d2b30fbe473c886dbe2cecb2&=&format=webp';

// Bot Ready Event
client.on('ready', () => {
    console.log(`${client.user.tag} is now online!`);
});

// 🆕 New Member Join
client.on('guildMemberAdd', async (member) => {
    const { user, guild } = member;

    try {
        const welcomeChannel = await guild.channels.fetch(process.env.WELCOME_CHANNEL_ID);
        if (!welcomeChannel) {
            console.error('Welcome channel is missing!');
            return;
        }

        // 🎉 Welcome Embed Message
        const welcomeEmbed = new EmbedBuilder()
            .setColor(process.env.THEME_COLOR || '#00ff00')
            .setTitle(`👋 Welcome, **${user.tag}**!`)
            .setDescription(`Hey **${user.tag}**, welcome to **${guild.name}**! 🎉 We're thrilled to have you here. Let's get you started!`)
            .addFields(
                { name: '🌐 **Server Rules**', value: '[Click here to read the rules](https://discord.com/channels/1339611622163087421/1339611623308005484)' },
                { name: '📝 **Application Channel**', value: '[Start your application here](https://discord.com/channels/1339611622163087421/1339921831703875594)' },
                { name: '🔧 **CAD/MDT**', value: '[Access CAD/MDT here](https://discord.com/channels/1339611622163087421/1339611623308005483)' },
                { name: '📊 **Server Status**', value: '[Check server status here](https://discord.com/channels/1339611622163087421/1339611623496880228)' },
            )
            .setThumbnail(LOGO_URL)
            .setImage(BACKGROUND_URL)
            .setFooter({ text: `User ID: ${user.id}` })
            .setTimestamp();

        // Send Welcome Embed
        await welcomeChannel.send({ embeds: [welcomeEmbed] });

    } catch (error) {
        console.error('Error with the welcome message:', error);
    }
});

// 👋 Goodbye Embed Message
client.on('guildMemberRemove', async (member) => {
    const { user, guild } = member;

    try {
        const goodbyeChannel = await guild.channels.fetch(process.env.GOODBYE_CHANNEL_ID);
        if (!goodbyeChannel) {
            console.error('Goodbye channel is missing!');
            return;
        }

        // 👋 Goodbye Embed
        const goodbyeEmbed = new EmbedBuilder()
            .setColor(process.env.GOODBYE_EMBED_COLOR || '#FF6F61')
            .setTitle(`👋 Farewell, **${user.tag}**!`)
            .setDescription(`Oh no! **${user.tag}** has left the server. 😢\n\nWe hope to see you again soon!`)
            .addFields(
                { name: '🗓️ Joined on:', value: member.joinedAt.toLocaleDateString() },
                { name: '💬 Last Activity:', value: member.lastMessage || 'No messages.' },
                { name: '💫 Special Goodbye:', value: `We hope **${user.tag}** returns soon.` }
            )
            .setThumbnail(LOGO_URL)
            .setImage(BACKGROUND_URL)
            .setFooter({ text: `User ID: ${member.id}` })
            .setTimestamp();

        // Send Goodbye Embed
        await goodbyeChannel.send({ embeds: [goodbyeEmbed] });

    } catch (error) {
        console.error('Error with the goodbye message:', error);
    }
});

// Logging: New Member Joins & Leaves
client.on('guildMemberAdd', async (member) => {
    const { user, guild } = member;

    try {
        const logChannel = await guild.channels.fetch(process.env.LOG_CHANNEL_ID);
        if (!logChannel) {
            console.error('Log channel is missing!');
            return;
        }

        const logEmbed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('✅ New Member Joined')
            .setDescription(`**${user.tag}** has joined the server!`)
            .addFields({ name: '🆔 User ID:', value: `${user.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] });

    } catch (error) {
        console.error('Error logging new member join:', error);
    }
});

// Logging: Member Leaves
client.on('guildMemberRemove', async (member) => {
    const { user, guild } = member;

    try {
        const logChannel = await guild.channels.fetch(process.env.LOG_CHANNEL_ID);
        if (!logChannel) {
            console.error('Log channel is missing!');
            return;
        }

        const logEmbed = new EmbedBuilder()
            .setColor('#FF6347')
            .setTitle('❌ Member Left')
            .setDescription(`**${user.tag}** has left the server.`)
            .addFields({ name: '🆔 User ID:', value: `${user.id}` })
            .setTimestamp();

        await logChannel.send({ embeds: [logEmbed] });

    } catch (error) {
        console.error('Error logging member leave:', error);
    }
});

// Error Logging
client.on('error', async (error) => {
    console.error('Bot error:', error);

    try {
        const errorLogChannel = await client.channels.fetch(process.env.ERROR_LOG_CHANNEL_ID);
        if (errorLogChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('⚠️ Bot Error')
                .setDescription(`An error occurred:\n\`\`\`${error.message}\`\`\``)
                .setTimestamp();

            await errorLogChannel.send({ embeds: [errorEmbed] });
        }
    } catch (err) {
        console.error('Error logging the error:', err);
    }
});

// Log in the bot
client.login(process.env.DISCORD_TOKEN);
