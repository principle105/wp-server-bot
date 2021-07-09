import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";
import User from "../../Models/user";

export const command: Command = {
  name: "level",
  aliases: ["rank"],
  args: ["user"],
  description: "",
  run: async (client, message, args) => {
    const author = args[0] || message.author;
    const user = await User.findOne({ userID: author.id });
    let embed = createEmbed("Levels", `${user.xp} xp`);
    message.channel.send(embed);
  },
};
