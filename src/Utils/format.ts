import { MessageEmbed } from "discord.js";
import { colours, botAvatar } from "../lib/constants";

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
