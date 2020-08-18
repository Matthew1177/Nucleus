import Event from '../lib/structures/Event';

export default class extends Event {
    execute (): void {
        console.log('[NC] - READY');
    }
} 