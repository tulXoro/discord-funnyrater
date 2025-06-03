import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { db } from "../db/schema";

interface LeaderboardUser {
    discord_id: string;
    username: string;
    total_score: number;
    message_count: number;
    average_score: number;
}

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Shows the funniest users in the server");

export async function execute(interaction: ChatInputCommandInteraction) {
    try {
        const topUsers = await db.getLeaderboard(10);

        if (topUsers.length === 0) {
            await interaction.reply({
                content: "No one has been rated yet.",
                ephemeral: true
            });
            return;
        }

        const leaderboardText = topUsers
            .map((user: LeaderboardUser, index: number) => {
                return `${index + 1}. <@${user.discord_id}> - Total Score: ${user.total_score} (Avg: ${user.average_score})`;
            })
            .join("\n");

        await interaction.reply({
            content: `🏆 **Funniest Users** 🏆\n\n${leaderboardText}`,
            ephemeral: true
        });
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        await interaction.reply({
            content: "Sorry, I couldn't fetch the leaderboard. Please try again later.",
            ephemeral: true
        });
    }
} 