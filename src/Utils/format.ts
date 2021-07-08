import { MessageEmbed } from "discord.js";
import { colours, botAvatar } from "../lib/constants";
import WordPractice from "../Client";
import { User } from "discord.js";

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
  argsGiven: string[],
  cmdArgs: string[]
): any[] => {
  if (!argsGiven.length || !Object.keys(cmdArgs).length) return argsGiven;

  if (argsGiven.length < Object.keys(cmdArgs).length) {
    throw "";
  }
  return cmdArgs.map((argType, i) => {
    return convertArgumentToType(argsGiven[i], argType);
  });
};

// Not Finished
const convertArgumentToType = (arg: string, type: string) => {
  switch (type) {
    case "string":
      return arg;
    case "number":
      let newArg = parseInt(arg);
      if (!newArg) throw "That is not a valid number";
      return newArg;
    default:
      return arg;
  }
};
