import { REST, Routes } from 'discord.js';
import type { RESTPostAPIApplicationCommandsResult } from "discord.js";
import 'dotenv/config';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
    const commands = [];

    const foldersPath = path.join(__dirname, '..', 'commands');
    
    const commandFolders = fs.readdirSync(foldersPath); 

    for (const folder of commandFolders) {
        const commandsPath = path.join(foldersPath, folder);

        try {
            const isDirectory = fs.statSync(commandsPath).isDirectory();

            if (isDirectory) {
                const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
                
                for (const file of commandFiles) {
                    const filePath = path.join(commandsPath, file);
                    
                    const commandModule = await import(`file://${filePath}`);
                    const command = commandModule.default || commandModule;
    
                    if ('slashCommand' in command) {
                        commands.push(command.slashCommand.toJSON())
                    }
                }
            }
            
        } catch (error) {
            console.error(`Error loading command folder or file: ${commandsPath}`, error.message);
        }
    }

    console.dir(commands)
    const response = await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands }) as any[];
    console.log(`Successfully reloaded ${response.length} application slash commands.`);
})();