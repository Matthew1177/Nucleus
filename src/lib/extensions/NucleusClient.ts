import {Client, ClientOptions} from 'discord.js';
import {readdir} from 'fs';
import {join, basename} from 'path';
import Database from '../structures/Database';
import Event from '../structures/Event';

type NucleusOptions = {
  databaseURI: string;
  database: string;
  defaultPrefix: string;
};

export default class NucleusClient extends Client {
  extraData: Record<string, unknown> = {};
  database: Database;

  constructor(nucleusOptions: NucleusOptions, clientOptions?: ClientOptions) {
    super(clientOptions);
    this.database = new Database(this, nucleusOptions.databaseURI, {
      defaultGuildPrefix: nucleusOptions.defaultPrefix,
      databaseName: nucleusOptions.database,
    });
  }

  public loadEvents(dir: string): void {
    readdir(dir, (err, files) => {
      if (err !== null) return console.error(err);
      //let total = 0;
      console.log(`Loading Events from '${dir}'`);
      files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const name = basename(file).split('.').slice(0, -1).join('.');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const eventFile = (r => r.default)(require(`${join(dir, file)}`));
        const event = new eventFile(this, name) as Event;

        this[event.once ? 'once' : 'on'](event.name, (...args: unknown[]) =>
          event.execute(...args)
        );
        //console.log(`Loaded Event '${event.name}'`);
        //++total;
      });
      //console.log(`Loaded ${total} Events`);
    });
  }
}
