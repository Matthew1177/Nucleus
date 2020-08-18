import Event from '../lib/NucleusClient';

export default class extends Event {
    execute (): void {
        console.log('[NC] - Ready');
    }
} 