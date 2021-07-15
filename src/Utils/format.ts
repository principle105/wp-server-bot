import { MessageEmbed, User } from "discord.js";
import { colours, botAvatar } from "../lib/constants";
import WordPractice from "../Client";
import { Argument } from "../Interfaces/Command";

export const createEmbed = (
    title: string,
    description: string,
    colour: number = colours.green
): MessageEmbed => {
    return new MessageEmbed()
        .setTitle(title)
        .setDescription(description)
        .setColor(colour)
        .setTimestamp(new Date())
        .setFooter("wordPractice Helper", botAvatar);
};

export const getUserFromMention = (
    client: WordPractice,
    mention: string
): User | null => {
    if (mention) {
        if (mention.startsWith("<@") && mention.endsWith(">")) {
            mention = mention.slice(2, -1);

            if (mention.startsWith("!")) {
                mention = mention.slice(1);
            }

            return client.users.cache.get(mention);
        }
    }
    return null;
};

export const evaluateArguments = (
    client: WordPractice,
    argsGiven: string[],
    cmdArgs: string[],
    required: number
): Argument[] => {
    // Checking if no arguments are asked for
    if (!Object.keys(cmdArgs).length) return [];

    // Checking if amount of arguments given is less than required amount
    if (argsGiven.length < required)
        throw "You are missing a required argument";

    return cmdArgs.map((argType, i) => {
        if (!argsGiven[i]) return null;
        return convertArgumentToType(client, argsGiven[i], argType);
    });
};

// Not Finished
const convertArgumentToType = (
    client: WordPractice,
    arg: string,
    type: string
): Argument => {
    switch (type) {
        case "string":
            return arg;
        case "number":
            let newArg = parseInt(arg);
            if (!newArg) throw "That is not a valid number";
            return newArg;
        case "user":
            let user = getUserFromMention(client, arg);
            if (!user) throw "That is not a valid user";
            return user;
        default:
            return arg;
    }
};
