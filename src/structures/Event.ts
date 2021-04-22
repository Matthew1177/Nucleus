import NucleusClient from '../extensions/NucleusClient';

export default abstract class Event {
  client: NucleusClient;
  abstract name: string;
  once = false;

  constructor(client: NucleusClient) {
    this.client = client;
  }

  abstract execute(...args: unknown[]): void;
}
