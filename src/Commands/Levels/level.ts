import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";
import { User } from "discord.js";
import UserModel from "../../Models/user";
import { getUserInfo } from "../../Utils/database";

export const command: Command = {
    name: "level",
    aliases: ["rank", "levels", "ranks"],
    args: ["user"],
    description: "",
    run: async (client, message, args, user) => {
        const userGiven = args[0] as User;
        const userData =
            userGiven && userGiven !== message.author
                ? await getUserInfo(userGiven)
                : user;
        const embed = createEmbed("Levels", `${userData.xp} xp`);
        message.channel.send(embed);
    },
};
