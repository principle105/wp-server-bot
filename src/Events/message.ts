import { Event, Command } from "../Interfaces";
import { Message } from "discord.js";
import { blacklistedWords } from "../Assets/blacklistedWords";
import User from "../Models/user";
import { evaluateArguments } from "../Utils/format";
import { createEmbed } from "../Utils/format";
import { colours } from "../lib/constants";
import { Argument } from "../Interfaces/Command";
import { getUserInfo } from "../Utils/database";

export const event: Event = {
    name: "message",
    run: async (client, message: Message) => {
        try {
            if (message.author.bot || !message.guild) return;

            // Leveling System
            if (!message.content.startsWith(client.config.prefix)) {
                const xpEarned = Math.floor(Math.random() * 10) + 15;
                await getUserInfo(message.author, true, ["xp", xpEarned]);
                return;
            }

            // Handling arguments
            let rawArgs = message.content
                .slice(client.config.prefix.length)
                .trim()
                .split(/ +/g);
            const commandName = rawArgs.shift().toLowerCase();

            const command =
                client.commands.get(commandName) ||
                client.aliases.get(commandName);

            // Checking if command is valid
            if (!command) return;

            let args: Argument[] = [];
            // Converting arguments to appropriate types
            if (command?.args) {
                args = evaluateArguments(
                    client,
                    rawArgs,
                    command.args,
                    command.required || 0
                );
            }
            (command as Command).run(
                client,
                message,
                args,
                await getUserInfo(message.author)
            );

            // Auto Moderator
            blacklistedWords;
        } catch (err) {
            let embed = createEmbed("Error", `${err}`, colours.red);
            message.channel.send(embed);
        }
    },
};
