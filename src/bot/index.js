import { Client, Events, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { processAttachment } from './imageProcessor.js';
import { saveDeposit } from '../utils/storage.js';
import { logEvent } from '../utils/logger.js';

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Bot ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.channelId !== process.env.DISCORD_CHANNEL_ID) return;
  
  if (message.attachments.size > 0) {
    try {
      for (const attachment of message.attachments.values()) {
        if (!attachment.contentType.startsWith('image/')) continue;
        
        console.log(`Processing image from ${message.author.username}: ${attachment.url}`);
        
        const results = await processAttachment(attachment.url, message.author.username);
        
        if (results && results.length > 0) {
          for (const result of results) {
            await saveDeposit({
              userId: message.author.id,
              username: message.author.username,
              messageId: message.id,
              timestamp: message.createdTimestamp,
              itemName: result.itemName,
              quantity: result.quantity
            });
            
            logEvent('deposit_recorded', {
              username: message.author.username,
              itemName: result.itemName,
              quantity: result.quantity
            });
          }
          
          await message.reply(`Recorded ${results.length} deposit(s)!`);
        } else {
          await message.reply("I couldn't identify any items in your image.");
        }
      }
    } catch (error) {
      console.error('Error processing message attachment:', error);
      await message.reply('Sorry, I encountered an error while processing your image.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

export default client;