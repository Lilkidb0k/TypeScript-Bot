import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Dynamically loads event modules from files in the 'events' folder.
 * @param {import('discord.js').Client} client - The Discord.js Client instance.
 */
export async function loadEvents(client) {
    const rootDir = path.resolve(__dirname, '..'); 
    const eventsPath = path.join(rootDir, 'events');

    try {
        const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const eventObject = await import(`file://${filePath}`);
            const event = eventObject.default;
            if (event.once) {
                client.once(event.name, (...args) => event.run(...args));
            } else {
                client.on(event.name, (...args) => event.run(...args));
            }
        }
    } catch (error) {
        console.error(`Error reading the events folder: ${eventsPath}`, error.message);
    }
}