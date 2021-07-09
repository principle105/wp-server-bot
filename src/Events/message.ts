import { Event, Command } from "../Interfaces";
import { Message } from "discord.js";
import { blacklistedWords } from "../Assets/blacklistedWords";
import User from "../Models/user";
import { evaluateArguments } from "../Utils/format";
import { createEmbed } from "../Utils/format";
import { colours } from "../lib/constants";

export const event: Event = {
  name: "message",
  run: async (client, message: Message) => {
    try {
      if (message.author.bot || !message.guild) return;

      const a = message.author;

      // Leveling System
      if (!message.content.startsWith(client.config.prefix)) {
        let oldUser = await User.findOne({ userID: a.id });
        // Copying the oldUser variable without linking
        let user = JSON.parse(JSON.stringify(oldUser));
        const xpEarned = Math.floor(Math.random() * 10) + 15;
        // Creating an account for the user if they do not have one already
        if (!oldUser) {
          user = await User.create({
            userID: a.id,
            name: a.username,
            discriminator: a.discriminator,
            avatar: a.avatar,
            xp: xpEarned,
          });
        } else {
          if (
            a.username !== oldUser.name ||
            a.discriminator !== oldUser.discriminator ||
            a.avatar !== oldUser.avatar
          ) {
            // Updating user object to perform update query all at once
            user.name = a.username;
            user.discriminator = a.discriminator;
            user.avatar = a.avatar;
          }
          user.xp = user.xp + xpEarned;
          // Updating user in database if user object changes
          if (user !== oldUser) {
            await User.updateOne({ userID: a.id }, user);
          }
        }
        return;
      }

      // Handling arguments
      let args = message.content
        .slice(client.config.prefix.length)
        .trim()
        .split(/ +/g);
      const commandName = args.shift().toLowerCase();

      const command =
        client.commands.get(commandName) || client.aliases.get(commandName);

      // Checking if command is valid
      if (command) {
        // Converting arguments to appropriate types
        if (command?.args) {
          args = evaluateArguments(
            client,
            args,
            command.args,
            command.required || 0
          );
        }
        (command as Command).run(client, message, args);
      }

      // Auto Moderator
      blacklistedWords;
    } catch (err) {
      let embed = createEmbed("Error", `${err}`, colours.red);
      message.channel.send(embed);
    }
  },
};
