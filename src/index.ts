import { CacheType, Client, Interaction } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/lib";
import { config } from "./config";
import { db } from "./db/schema";

// import { evalMessage } from "./util/evaluateMessage";

const CLIENT = new Client({
    intents: [
        "Guilds", 
        "GuildMessages", 
        "DirectMessages",
        "MessageContent",
        "GuildMembers",
    ],
});

CLIENT.once("ready", async () => {
    console.log("Bot is up and ready to rate your messages.");

    // Initialize database
    await db.initialize();

    // Deploy commands for every guild the bot is in
    const guilds = await CLIENT.guilds.fetch();
    for (const [guildId] of guilds) {
        await deployCommands({ guildId });
    }


});

CLIENT.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

CLIENT.on(
    "interactionCreate",
    async (interaction: Interaction<CacheType>) => {
        if (interaction.isChatInputCommand()) {
            const { commandName } = interaction;
            const command = commands[commandName as keyof typeof commands];
            if (command && typeof command.execute === "function") {
                await (command.execute as (i: typeof interaction) => Promise<void>)(interaction);
            }
        } else if (interaction.isMessageContextMenuCommand()) {
            const { commandName } = interaction;
            const command = commands[commandName as keyof typeof commands];
            if (command && typeof command.execute === "function") {
                await (command.execute as (i: typeof interaction) => Promise<void>)(interaction);
            }
        }
    }
);

// CLIENT.on(
//     "messageCreate",
//     async (message) => {
//         if (message.author.bot) return;

//         if (!await isFunny(message.content)) {
//             console.log("Message not funny. Not evaluating.")
//             return
//         } else {
//         console.log("Passed Funny check")
//         }

//         let response = await evalMessage(message.content, "null");
//         if (!response) return;
//         message.reply((response).explanation)
//     }
// )

CLIENT.login(config.DISCORD_TOKEN);
