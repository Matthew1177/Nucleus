import NucleusClient from '../extensions/NucleusClient';

export default abstract class Event {
  abstract readonly name: string;
  readonly once = false;

  constructor(readonly client: NucleusClient) {}

  abstract execute(...args: unknown[]): void;
}
