const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    name: "volume",
    data: new SlashCommandBuilder()
        .setName("volume")
        .setDescription("Chỉnh âm lượng cho Bot")
        .addIntegerOption(option => option.setName("mức").setMinValue(0).setMaxValue(100).setRequired(true).setDescription("Âm lượng muốn chỉnh")),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.editReply(`Ê cu vào voice đi!`);
        const vol = interaction.options.getInteger("mức");

        const player = client.lavalink.get(interaction.guild.id);

        player.setVolume(parseInt(vol));
        return interaction.editReply("✅ Thành công!");
    },
};