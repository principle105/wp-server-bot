import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";

export const command: Command = {
  name: "level",
  aliases: ["rank"],
  args: ["user"],
  description: "",
  run: async (client, message, args) => {
    let embed = createEmbed("Levels", `${args}`);
    message.channel.send(embed);
  },
};
