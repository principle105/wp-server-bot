import { Command } from "../../Interfaces";

export const command: Command = {
  name: "ping",
  aliases: ["p"],
  description: "",
  run: async (client, message, args) => {
    message.channel.send(`Pong! ${client.ws.ping} ms`);
  },
};
