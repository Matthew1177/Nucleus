import dotenv from 'dotenv';
import NucleusClient from './lib/NucleusClient';

dotenv.config();
const client = new NucleusClient();

client.login(process.env.TOKEN);