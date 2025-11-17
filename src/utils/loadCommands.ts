import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically loads command modules from subdirectories in the 'commands' folder.
 * @param {import('discord.js').Client} client - The Discord.js Client instance.
 */
export async function loadCommands(client) {
    const rootDir = path.resolve(__dirname, '..'); 
    const foldersPath = path.join(rootDir, 'commands');

    try {
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
            
                        if ('name' in command && 'run' in command) {
                            client.commands.set(command.name, command);
                        } else {
                            console.log(`[WARNING] The command at ${filePath} is missing a required "name" or "run" property.`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error loading command folder or file: ${commandsPath}`, error.message);
            }
        }
    } catch (error) {
        console.error(`Error reading the commands folder: ${foldersPath}`, error.message);
    }
}