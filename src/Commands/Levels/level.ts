import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";
import { getUserInfo } from "../../Utils/database";
import { User } from "discord.js";

export const command: Command = {
    name: "level",
    aliases: ["rank", "levels", "ranks"],
    args: ["user"],
    description: "",
    cooldown: 5,
    run: async (client, message, args) => {
        const userGiven = (args[0] || message.author) as User;
        const userData = await getUserInfo(userGiven);
        const embed = createEmbed("Levels", `${userData.xp} xp`);
        message.channel.send(embed);
    },
};
