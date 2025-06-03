import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction } from "discord.js";
import { evalMessage } from "../util/evaluateMessage";
import { fetchImageAsBase64 } from "../util/fetchImage";
import { captionImage } from "../util/captionImage";
import { db } from "../db/schema";

export const data = new ContextMenuCommandBuilder()
    .setName("ratefunny")
    .setType(ApplicationCommandType.Message);

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });
    let message = interaction.targetMessage;
    let content = message.content;

    if (message.author.bot) {
        return interaction.editReply({
            content: `❓<@${interaction.user.id}> bruh❓ you really thought I would rate that?`,
            allowedMentions: { users: [interaction.user.id] }
        });
    }

    // Check if message was already rated
    const existingMessage = await db.findMessageByDiscordId(message.id);
    if (existingMessage) {
        return interaction.editReply({
            content: `This message was already rated with a score of ${existingMessage.score}. You aren't slick.`,
            allowedMentions: { users: [message.author.id] }
        });
    }

    // Check for image attachment
    const imageAttachment = message.attachments.find(att => att.contentType?.startsWith("image/"));
    let imageCaption = "";
    if (imageAttachment) {
        const base64 = await fetchImageAsBase64(imageAttachment.url);
        imageCaption = await captionImage(base64) || "";
    }

    // Combine image caption with message content for evaluation
    let combinedContent = content;
    if (imageCaption) {
        combinedContent += `\n[Image]: ${imageCaption}`;
    }

    let response = await evalMessage(combinedContent, message.author.id);
    if (!response) {
        return interaction.editReply("Failed to evaluate the message.");
    }

    try {
        // Get or create user
        let user = await db.findUserByDiscordId(message.author.id);
        if (!user) {
            user = await db.createUser(message.author.id, message.author.username, response.score);
        } else {
            // If score is less than 3, subtract from total score
            const scoreToAdd = response.score < 3 ? -response.score : response.score;
            await db.updateUserScore(user.id, scoreToAdd);
        }

        // Store message rating
        const newMessage = await db.createMessage(message.id, user.id, combinedContent, response.score);

        // Store image if present
        if (imageAttachment) {
            await db.createMessageImage(newMessage.id, imageAttachment.url, imageCaption);
        }

        // Delete the ephemeral message and send a new non-ephemeral one
        await interaction.deleteReply();
        return interaction.followUp({
            content: `${response.explanation} <@${message.author.id}>`,
            allowedMentions: { users: [message.author.id] }
        });
    } catch (error) {
        console.error("Error storing rating:", error);
        return interaction.editReply("Failed to store the rating.");
    }
}