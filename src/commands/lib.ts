// import * as ping from "./ping"
import type { ChatInputCommandInteraction, MessageContextMenuCommandInteraction } from "discord.js";
import * as help from "./help";
import * as rate from "./rate";
import * as leaderboard from "./leaderboard";
import * as resetLeaderboard from "./resetLeaderboard";

type Command =
  | { data: any; execute: (interaction: ChatInputCommandInteraction) => Promise<any> }
  | { data: any; execute: (interaction: MessageContextMenuCommandInteraction) => Promise<any> };

export const commands: Record<string, Command> = {
    help,
    ratefunny: rate,
    leaderboard,
    resetleaderboard: resetLeaderboard
}