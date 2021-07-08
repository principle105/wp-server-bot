import { Event, Command } from "../Interfaces";
import { Message } from "discord.js";
import { blacklistedWords } from "../Assets/blacklistedWords";
import User from "../Models/user";
import { evaluateArguments } from "../Utils/format";

export const event: Event = {
  name: "message",
  run: async (client, message: Message) => {
    if (message.author.bot || !message.guild) return;

    const a = message.author;

    // Leveling System
    if (!message.content.startsWith(client.config.prefix)) {
      let oldUser,
        user = await User.findOne({ userID: a.id });
      // Creating an account for the user if they do not have one already
      if (!oldUser) {
        oldUser = await User.create({
          userID: a.id,
          name: a.username,
          discriminator: a.discriminator,
          avatar: a.avatar,
        });
      } else if (
        [a.username, a.discriminator, a.avatar] !==
        [oldUser.name, oldUser.discriminator, oldUser.avatar]
      ) {
        // Updating user object to perform update query all at once
        user.name = a.username;
        user.discriminator = a.discriminator;
        user.avatar = a.avatar;
      }
      user.xp += Math.floor(Math.random() * 3);
      // Updating user in database if user object changes
      if (user !== oldUser) {
        await User.updateOne({ userID: a.id }, user);
      }
      return;
    }

    // Handling arguments
    let args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const commandName = args.shift().toLowerCase();

    // Checking if command is valid
    if (!client.commands.has(commandName)) return;

    console.log("beforears", args);
    let newargs = evaluateArguments(args, ["string", "number"]);
    console.log("newargs", newargs);

    const command =
      client.commands.get(commandName) || client.aliases.get(commandName);
    if (command) (command as Command).run(client, message, newargs);

    // Auto Moderator
    blacklistedWords;
  },
};
