import { CacheType, Client, Interaction } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands/lib";
import { config } from "./config";

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
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        if (commands[commandName as keyof typeof commands]) {
            commands[commandName as keyof typeof commands].execute(interaction);
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
