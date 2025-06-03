import { CommandInteraction, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information related to this bot.");

export async function execute(interaction: ChatInputCommandInteraction) {
    return interaction.reply("This bot responds to messages and rates them. Right click a message and let me rate it.");
}
