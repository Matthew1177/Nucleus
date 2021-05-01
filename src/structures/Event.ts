import Base from './Base';

export default abstract class Event extends Base {
  abstract readonly name: string;
  readonly once = false;

  abstract execute(...args: unknown[]): void;
}
