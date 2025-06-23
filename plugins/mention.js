const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

bot(
  {
    pattern: 'mention ?(.*)',
    desc: lang.plugins.mention.desc,
    type: 'misc',
  },
  async (message, match) => {
    try {
      // Handle case when no match is provided (show current status)
      if (!match) {
        const mention = await getMention(message.id);
        const status = mention?.enabled ? 'on' : 'off';
        return await message.send(
          lang.plugins.mention.current_status.format(status)
        );
      }

      // Handle 'get' command
      if (match === 'get') {
        const msg = await mentionMessage(message.id);
        if (!msg) {
          return await message.send(lang.plugins.mention.not_activated);
        }
        return await message.send(msg);
      }

      // Handle enable/disable commands
      if (match === 'on' || match === 'off') {
        await enableMention(match === 'on', message.id);
        const response = match === 'on' 
          ? lang.plugins.mention.activated 
          : lang.plugins.mention.deactivated;
        return await message.send(response);
      }

      // Handle custom mention message
      await enableMention(match, message.id);
      clearFiles();
      return await message.send(lang.plugins.mention.updated);
      
    } catch (error) {
      console.error('Error in mention plugin:', error);
      // Optionally send an error message to the user
      // return await message.send(lang.plugins.mention.error);
    }
  }
);
