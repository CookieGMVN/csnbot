const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { MoonlinkManager } = require('moonlink.js');
const { Manager } = require("@cookiegmvn/erela");
const CSN = require("csn.js");
const Config = require("./data/config.json");
const fs = require("fs");

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.Guilds,
    ],
    partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
    ],
});

client.commands = new Collection();

const commandFolders = fs.readdirSync("./commands");
for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`./commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}

client.lavalink = new Manager({
    // The nodes to connect to, optional if using default lavalink options
    nodes: [Config.lavalink],
    // Method to send voice data to Discord
    send: (id, payload) => {
        const guild = client.guilds.cache.get(id);
        // NOTE: FOR ERIS YOU NEED JSON.stringify() THE PAYLOAD
        if (guild) guild.shard.send(payload);
    },
});

client.csn = new CSN();

client.lavalink.on("nodeConnect", async () => {
    console.log("Lavalink connected!");
});

client.on("ready", async () => {
    console.log("Bot ready!");
    client.lavalink.init(client.user.id);
});

client.on('raw', (payload) => client.lavalink.updateVoiceState(payload));

client.on("interactionCreate", async interaction => {
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.guild) return interaction.editReply({ message: "Bạn không thể dùng bot trong DM (Tin nhắn trực tiếp)!", ephemeral: true });
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        return interaction.editReply({
            content: "Có (các) lỗi đã xảy ra khi thực hiện câu lệnh này.",
            ephemeral: true,
        });
    }
});

client.login(Config.discord.token);