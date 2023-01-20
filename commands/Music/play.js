const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    name: "play",
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Phát một bài hát")
        .addStringOption(option => option.setName("tên_bài_hát").setRequired(true).setDescription("Tên bài hát")),
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) return interaction.editReply(`Ê cu vào voice đi!`);
        const songName = interaction.options.getString("tên_bài_hát");

        const player = client.lavalink.create({
            guild: interaction.guildId,
            voiceChannel: interaction.member.voice.channel.id,
            textChannel: interaction.channel.id,
        });

        if (!player.connected) player.connect();

        const songList = await client.csn.search.song(songName);
        const song = songList[0];

        const linkList = await song.getAudioUrl();
        const link = linkList.find(link => link.label === "128kbps");
        const res = await client.lavalink.search(link.url);

        if (res.loadType === "LOAD_FAILED") {
            return interaction.editReply(`:x: Tải bài hát thất bại.`);
        }
        player.queue.add(res.tracks[0]);

        const response = new EmbedBuilder()
        .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
        .setTitle("Đã thêm bài hát thành công!")
        .setDescription(`**Tên bài hát:** ${song.title}\n**Nghệ sĩ:** ${song.artist}`)
        .setThumbnail(song.coverURL)
        .setFooter({ text: "Powered by Lavalink, MoonLink.js and csn.js." });

        interaction.editReply({ embeds: [response] });
        if (!player.playing) player.play();
    },
};