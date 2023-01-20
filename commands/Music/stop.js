const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: "stop",
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Dừng trình phát"),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.editReply("Cu không vào voice thì pause kiểu gì?");

        const player = client.lavalink.get(interaction.guild.id);
        player.stop();
        return interaction.editReply("✅ Đã dừng!");
    },
};