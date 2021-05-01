import NucleusClient from '../extensions/NucleusClient';

export default abstract class Base {
  constructor(readonly client: NucleusClient) {}
}
