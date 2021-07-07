import { Event, Command } from "../Interfaces";
import { Message } from "discord.js";
import { blacklistedWords } from "../Assets/blacklistedWords";
import User from "../Models/user";

export const event: Event = {
  name: "message",
  run: async (client, message: Message) => {
    if (message.author.bot || !message.guild) return;

    const a = message.author;

    // Leveling System
    if (!message.content.startsWith(client.config.prefix)) {
      let user = await User.findOne({ userID: a.id });
      // Creating an account for the user if they do not have one already
      if (!user) {
        user = await User.create({
          userID: a.id,
          name: a.username,
          discriminator: a.discriminator,
          avatar: a.avatar,
        });
      } else if (
        [a.username, a.discriminator, a.avatar] !==
        [user.name, user.discriminator, user.avatar]
      ) {
        // Updating user in database
        await User.updateOne(
          { userID: message.author.id },
          {
            name: a.username,
            discriminator: a.discriminator,
            avatar: a.avatar,
          }
        );
      }
      return;
    }

    // Handling arguments
    const args = message.content
      .slice(client.config.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (!cmd) {
      return;
    }

    const command = client.commands.get(cmd) || client.aliases.get(cmd);
    if (command) (command as Command).run(client, message, args);

    // Auto Moderator
    blacklistedWords;
  },
};
