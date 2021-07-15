import Client from "../Client";
import { Message, User, GuildMember } from "discord.js";

export type Argument = User | GuildMember | string | number | null;

interface Run {
    (client: Client, message: Message, args: Argument[] | null);
}

export interface Command {
    name: string;
    description: string;
    aliases?: string[];
    args?: string[];
    required?: number;
    cooldown?: number;
    run: Run;
}
