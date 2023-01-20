const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    name: "ping",
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Xem độ trễ của Bot'),
    async execute(interaction, client) {
        const ping = new Discord.MessageEmbed()
            .setColor("#ffb7c5")
            .setDescription(`🏓Pong!\nĐộ trễ Bot: ${Math.abs(Date.now() - message.createdTimestamp)}ms\nĐộ trễ Discord API: ${Math.round(client.ws.ping)}ms`);
        return interaction.editReply({ embeds: [ping] });
    },
};