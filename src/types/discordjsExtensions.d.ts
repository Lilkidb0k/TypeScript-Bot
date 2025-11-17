import "discord.js";

declare module "discord.js" {
  interface CommandInteraction {
    success(content: string, ephemeral?: boolean): Promise<Message>;
    warning(content: string, ephemeral?: boolean): Promise<Message>;
    fail(content: string, ephemeral?: boolean): Promise<Message>;
    loading(content?: string, ephemeral?: boolean): Promise<Message>;
  }

  interface Message {
    success(content: string): Promise<Message>;
    warning(content: string): Promise<Message>;
    fail(content: string): Promise<Message>;
    loading(content?: string): Promise<Message>;
  }

  interface Client {
    commands: Collection<string, any>;
  }
}