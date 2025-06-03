import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from "discord.js";
import { db } from "../db/schema";

export const data = new SlashCommandBuilder()
    .setName("resetleaderboard")
    .setDescription("Reset the leaderboard by clearing all ratings (Server Owner only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

export async function execute(interaction: ChatInputCommandInteraction) {
    // Check if the user is the server owner
    if (interaction.guild?.ownerId !== interaction.user.id) {
        await interaction.reply({
            content: "Only the server owner can reset the leaderboard!",
            ephemeral: true
        });
        return;
    }

    try {
        await db.resetLeaderboard();
        await interaction.reply({
            content: "✅ Leaderboard has been reset! All ratings have been cleared.",
            ephemeral: true
        });
    } catch (error) {
        console.error("Error resetting leaderboard:", error);
        await interaction.reply({
            content: "Failed to reset the leaderboard. Please try again later.",
            ephemeral: true
        });
    }
} 