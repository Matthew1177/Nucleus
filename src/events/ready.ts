import { Event } from '../lib/';

export default class extends Event {
    execute (): void {
        console.log('[NC] - Ready');
    }
} 