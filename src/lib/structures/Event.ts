import NucleusClient from '../extensions/NucleusClient';

export default class Event {
  client: NucleusClient;
  name: string;
  once = false;

  constructor(client: NucleusClient, name: string) {
    this.client = client;
    this.name = name;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(...args: unknown[]): void {
    throw new Error('Unsupported operation.');
  }
}
