import { JUDGE_PROMPT as basePrompt } from "./systemPrompt";
import { USER_MAP } from "./userMap";

export const evalMessage = async (message: string, author: string) => {
    // replace any mentions with their respective user if possible
    const replacedMessage = message.replace(/<@!?(\d+)>/g, (match, userId) => {
        return USER_MAP[userId as keyof typeof USER_MAP] || match;
    });
    const prompt = basePrompt.replace("{{USER_MESSAGE}}", replacedMessage).replace("{{AUTHOR}}", USER_MAP[author as keyof typeof USER_MAP]);

    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model: "qwen3",
            prompt,
            stream: false,
        }),
        headers: { "Content-Type": "application/json" },
    });

    try {
        const data = await res.json();
        const fullText = data.response;
        console.log(
            "Getting response.",
            "\n\nFULL INPUT:",
            prompt,
            "\n\n"
        )


        console.log(
            "FULLL OUTPUT.\n\n",
            fullText,
            "\n\n"
        )


        // const scoreMatch = fullText.match(/<score>\{"score":\s*(\d+)\}<\/score>/);
        // const score = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

        const verdict = fullText.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

        return {
            explanation: verdict
        };

    } catch (e) {
        console.log(e)
    }


};




