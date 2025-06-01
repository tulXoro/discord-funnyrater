import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("help")
    .setDescription("Provides information related to this bot.");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("This bot responds to messages and rates them.");
}
