import Collection from '@discordjs/collection';

declare module 'discord.js' {
  export interface Client {
    commands: Collection<unknown, any>;
  }
}
