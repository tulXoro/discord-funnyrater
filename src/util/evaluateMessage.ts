import { JUDGE_PROMPT as basePrompt } from "./systemPrompt";
import { USER_MAP } from "./userMap";
import { db } from "../db/schema";

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'localhost';

export const evalMessage = async (message: string, author: string) => {
    try {
        // Get author's current stats
        const user = await db.findUserByDiscordId(author);
        const authorScore = user ? Number(user.average_score).toFixed(2) : "0.00";
        const authorMessages = user ? user.message_count : 0;

        // replace any mentions with their respective user if possible
        const replacedMessage = message.replace(/<@!?(\d+)>/g, (match, userId) => {
            return USER_MAP[userId as keyof typeof USER_MAP] || match;
        });

        const prompt = basePrompt
            .replace("{{USER_MESSAGE}}", replacedMessage)
            .replace("{{AUTHOR}}", USER_MAP[author as keyof typeof USER_MAP])
            .replace("{{AUTHOR_SCORE}}", authorScore)
            .replace("{{AUTHOR_MESSAGES}}", authorMessages.toString());

        const res = await fetch(`http://${OLLAMA_HOST}:11434/api/generate`, {
            method: "POST",
            body: JSON.stringify({
                model: "qwen3",
                prompt,
                stream: false,
            }),
            headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
            throw new Error(`Ollama API error: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();
        
        if (!data || !data.response) {
            throw new Error('Invalid response from Ollama');
        }

        const fullText = data.response;
        console.log(
            "Getting response.",
            "\n\nFULL INPUT:",
            prompt,
            "\n\n"
        );

        console.log(
            "FULL OUTPUT.\n\n",
            fullText,
            "\n\n"
        );

        // Extract the score from the response
        const scoreMatch = fullText.match(/<score>(\d+)<\/score>/);
        const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 0;

        // Remove the score tag and any think tags from the response
        const verdict = fullText
            .replace(/<score>\d+<\/score>/g, '')
            .replace(/<think>[\s\S]*?<\/think>/gi, '')
            .trim();

        if (!verdict) {
            throw new Error('Empty response from Ollama');
        }

        return {
            explanation: verdict,
            score: score
        };

    } catch (e) {
        console.error('Error evaluating message:', e);
        return {
            explanation: "Sorry, I'm having trouble rating this message right now. Try again later!",
            score: 0
        };
    }
};




