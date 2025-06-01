import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("rate")
    .setDescription("Shows your rating");

export async function execute(interaction: CommandInteraction) {
    return interaction.reply("You're not funny little bro.");
}
