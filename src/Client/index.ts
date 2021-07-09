import { Client, Collection } from "discord.js";
import { connect } from "mongoose";
import { readdirSync } from "fs";
import path from "path";
import { Command, Event, Config } from "../Interfaces";
import configData from "../../config.json";

class WordPractice extends Client {
  public commands: Collection<string, Command> = new Collection();
  public events: Collection<string, Event> = new Collection();
  public aliases: Collection<string, Command> = new Collection();
  public config: Config = configData;

  public cooldowns: Collection<string, Collection<string, Date>> =
    new Collection();

  public async start() {
    console.log("Starting bot...");
    this.login(this.config.token);
    connect(this.config.mongodbURI, {
      useUnifiedTopology: true,
      useFindAndModify: true,
      useNewUrlParser: true,
    });

    // Commands
    const commandPath = path.join(__dirname, "..", "Commands");
    readdirSync(commandPath).forEach((dir) => {
      const commands = readdirSync(`${commandPath}/${dir}`).filter((fileName) =>
        fileName.endsWith(".ts")
      );
      for (const fileName of commands) {
        const { command } = require(`${commandPath}/${dir}/${fileName}`);
        this.commands.set(command.name, command);

        if (command?.aliases) {
          command.aliases.forEach((alias) => {
            this.aliases.set(alias, command);
          });
        }
      }
    });

    // Events
    const eventPath = path.join(__dirname, "..", "Events");
    readdirSync(eventPath).forEach(async (fileName) => {
      const { event } = await import(`${eventPath}/${fileName}`);
      this.events.set(event.name, event);
      this.on(event.name, event.run.bind(null, this));
    });
  }
}

export default WordPractice;
