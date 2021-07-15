import Client from "../Client";
import { Message, User } from "discord.js";
import { User as UserModel } from "../Interfaces/Models";

export type Argument = User | string | number | null;

interface Run {
    (
        client: Client,
        message: Message,
        args: Argument[] | null,
        user: UserModel
    );
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
