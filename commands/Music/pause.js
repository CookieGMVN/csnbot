const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");

module.exports = {
    name: "pause",
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Tạm dừng/Tiếp tục trình phát"),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.editReply("Cu không vào voice thì pause kiểu gì?");

        const player = client.lavalink.get(interaction.guild.id);
        if (!player.paused) {
            player.pause(true);
            return interaction.editReply("✅ Đã tạm dừng!");
        }
        if (player.paused) {
            player.pause(false);
            return interaction.editReply("✅ Đã tiếp tục phát!");
        }
    },
};