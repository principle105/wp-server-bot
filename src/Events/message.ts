import { Event, Command } from "../Interfaces";
import { Message, Collection } from "discord.js";
import { evaluateArguments } from "../Utils/format";
import { createEmbed } from "../Utils/format";
import { Argument } from "../Interfaces/Command";
import { getUserInfo } from "../Utils/database";

export const event: Event = {
    name: "message",
    run: async (client, message: Message) => {
        try {
            if (message.author.bot || !message.guild) return;

            const { cooldowns } = client;

            // Manages cooldowns
            const manageCooldown = (
                cmdName: string,
                length: number,
                showError: boolean = true
            ) => {
                if (!cooldowns.has(cmdName)) {
                    cooldowns.set(cmdName, new Collection());
                }
                const now = Date.now();
                const timestamps = cooldowns.get(cmdName);
                const cooldownAmount = length * 1000;
                if (timestamps.has(message.author.id)) {
                    const expirationTime =
                        timestamps.get(message.author.id) + cooldownAmount;

                    if (now < expirationTime) {
                        if (!showError) return;
                        const timeLeft = (expirationTime - now) / 1000;
                        const embed = createEmbed(
                            "Cooldown",
                            `Try again in ${timeLeft.toFixed(1)} second(s)`,
                            "red"
                        );
                        message.channel.send(embed);
                        return true;
                    }
                }
                timestamps.set(message.author.id, now);
                setTimeout(
                    () => timestamps.delete(message.author.id),
                    cooldownAmount
                );
            };

            // Leveling System
            if (!message.content.startsWith(client.config.prefix)) {
                manageCooldown("msg", 60, false);
                const xpEarned = Math.floor(Math.random() * 10) + 15;
                return await getUserInfo(message.author, true, xpEarned);
            }

            // Handling arguments
            let rawArgs: string[] = message.content
                .slice(client.config.prefix.length)
                .trim()
                .split(/ +/g);
            const commandName = rawArgs.shift().toLowerCase();

            const command =
                client.commands.get(commandName) ||
                client.aliases.get(commandName);

            // Checking if command is valid
            if (!command)
                return await message.channel.send(
                    createEmbed(
                        "Command Not Found",
                        `Type \`${client.config.prefix}help\` for a full list of commands`,
                        "red"
                    )
                );

            if (
                command.cooldown &&
                manageCooldown(command.name, command.cooldown)
            )
                return;

            let args: Argument[] = [];
            // Converting arguments to appropriate types
            if (command?.args) {
                args = evaluateArguments(
                    client,
                    message,
                    rawArgs,
                    command.args,
                    command.required || 0
                );
            }
            (command as Command).run(client, message, args);
        } catch (err) {
            let embed = createEmbed("Error", `${err}`, "red");
            message.channel.send(embed);
        }
    },
};
