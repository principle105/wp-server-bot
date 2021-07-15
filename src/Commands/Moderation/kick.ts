import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";
import { GuildMember } from "discord.js";

export const command: Command = {
    name: "kick",
    args: ["member", "string"],
    required: 1,
    description: "",
    cooldown: 3,
    run: async (client, message, args) => {
        const userGiven = (args[0] || message.author) as GuildMember;
        const reason = args[1] as string;
    },
};
