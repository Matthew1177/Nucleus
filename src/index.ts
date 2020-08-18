import dotenv from 'dotenv';
import NucleusClient from './lib/NucleusClient';
import { join } from 'path';

dotenv.config();
const client = new NucleusClient();

client.loadEvents(join(__dirname,'events'));

client.login(process.env.TOKEN);