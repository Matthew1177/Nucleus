require('dotenv').config();

import MessageEvent from './events/MessageEvent';
import NucleusClient from './extensions/NucleusClient';
import LoadExtensions from './utils/LoadExtensions';

LoadExtensions();

const client = new NucleusClient();

client.registerEvent(new MessageEvent(client));

client.login(process.env.TOKEN);
