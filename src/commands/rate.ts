import { ApplicationCommandType, ContextMenuCommandBuilder, MessageContextMenuCommandInteraction, messageLink, SlashCommandBuilder } from "discord.js";
import { evalMessage } from "../util/evaluateMessage";

import { fetchImageAsBase64 } from "../util/fetchImage";
import { captionImage } from "../util/captionImage";

export const data = new ContextMenuCommandBuilder()
    .setName("ratefunny")
    .setType(ApplicationCommandType.Message);


export async function execute(interaction: MessageContextMenuCommandInteraction) {
    await interaction.deferReply(); // <-- Add this line
    // The message being right-clicked is available as interaction.targetMessage
    let message = interaction.targetMessage
    let content = message.content;
    if (message.author.bot) {
        return interaction.editReply({
            content: `❓<@${interaction.user.id}> bruh❓ you really thought I would rate that?`,
            allowedMentions: { users: [interaction.user.id] }
        })
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

    console.log("\n\nImage Caption: ", imageCaption, "\n\n")

    let response = await evalMessage(combinedContent, message.author.id);

    return interaction.editReply({
        content: `${response?.explanation} <@${message.author.id}>`,
        allowedMentions: { users: [message.author.id] }
    });
}