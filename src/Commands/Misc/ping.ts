import { Command } from "../../Interfaces";
import { createEmbed } from "../../Utils/format";

export const command: Command = {
    name: "ping",
    aliases: ["p"],
    description: "",
    run: async (client, message) => {
        let embed = createEmbed("Pong!", `${client.ws.ping} ms`);
        message.channel.send(embed);
    },
};
