import "dotenv/config";
import { REST, Routes } from "discord.js";
import { prettyLog } from "./logging.js";
import { fileURLToPath } from 'url';
import fs from "fs";
import path from "path";
import { sleep } from "./general.js";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..', ".."); 
const pendingEmojisfolderPath = path.join(rootDir, 'images', "emojis", "pending");
const uploadedEmojisFolderPath = path.join(rootDir, "images", "emojis", "uploaded");

if (!fs.existsSync(pendingEmojisfolderPath)) fs.mkdirSync(pendingEmojisfolderPath, { recursive: true });
if (!fs.existsSync(uploadedEmojisFolderPath)) fs.mkdirSync(uploadedEmojisFolderPath, { recursive: true });

export async function uploadPendingEmojis() {
    prettyLog("EMOJIS", "purple", "Uploading pending emojis...")

    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!);

    async function uploadAppEmoji(emojiFile: string, name: string) {
        const app = await rest.get(Routes.oauth2CurrentApplication()) as any;
        const appId = app.id;

        const emojiPath = path.join(pendingEmojisfolderPath, emojiFile);
        const imageData = fs.readFileSync(emojiPath).toString("base64");
        const emoji = await rest.post(Routes.applicationEmojis(appId), {
            body: {
                name,
                image: `data:image/png;base64,${imageData}`
            }
        });

        const targetPath = path.join(uploadedEmojisFolderPath, emojiFile);

        fs.rename(emojiPath, targetPath, (err) =>
            {
                if (err) throw err;
                prettyLog("EMOJIS", "purple", `Uploaded emoji: ${name}`);
            }
        )
    };

    try {
        const pendingEmojisFolder = fs.readdirSync(pendingEmojisfolderPath); 

        if (pendingEmojisFolder.length == 0) {
            prettyLog("EMOJIS", "purple", "No emojis pending for upload")
        } else {
            for (const emojiFile of pendingEmojisFolder) {
                const emojiName = path.basename(emojiFile, path.extname(emojiFile))

                try {
                    await uploadAppEmoji(emojiFile, emojiName)
                    sleep(2500)
                } catch (error) {
                    prettyLog("EMOJIS", "red", `Error while uploading ${emojiName}:`)
                    console.log(error)
                }
            }
        }
        
    } catch (error) {
        prettyLog("EMOJIS", "red", "Error while reading pending emojis folder")
    }
}

async function downloadEmoji(url, filePath) {
    try {
        const res = await axios.get(url, { responseType: "arraybuffer" })
        fs.writeFileSync(filePath, res.data)
    } catch {
        console.log(`${url} failed`)
    }
}

const loadedEmojis: Record<string, any> = {};

export async function loadEmojis() {
    const rest = new REST({ version: "10" }).setToken(process.env.BOT_TOKEN!)
    const app = await rest.get(Routes.oauth2CurrentApplication()) as any
    const appId = app.id
    
    const emojisObj = await rest.get(Routes.applicationEmojis(appId)) as any
    const allEmojis = Object.values(emojisObj)[0]

    for (const emoji of Object.values(allEmojis)) {
        const animatedPrefix = emoji.animated ? "a" : ""
        loadedEmojis[emoji.name] = `<${animatedPrefix}:${emoji.name}:${emoji.id}>`
        
        const ext = (emoji.animated && ".gif") || ".png"
        const emojiPath = path.join(uploadedEmojisFolderPath, `${emoji.name}${ext}`)

        if (!fs.existsSync(emojiPath)) {
            prettyLog("EMOJIS", "purple", `Downloading missing emoji: ${emoji.name}`)
            await downloadEmoji(`https://cdn.discordapp.com/emojis/${emoji.id}${ext}`, emojiPath)
        }
    }
}

export const emojis = loadedEmojis