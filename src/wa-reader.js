'use strict';

var fs = require('fs'),
  grok = require('node-grok');

const ERRORS = {
  'invalidFile': { Error: 'File is not a valid WhatsApp chat file.', errno: -1, code: 'INVALID_FILE'}
};

module.exports = {
  parse: function(chatText, lastDate, callback) {
    if (typeof(lastDate) == 'function') {
      callback = lastDate;
      lastDate = null;
    }

    var err = null;

    var patterns = grok.loadDefaultSync();
    patterns.createPattern('%{HOUR}:%{MINUTE}', 'WA_TIME');
    patterns.createPattern('(.*\n)+', 'WA_CHAT')

    var waChat  = '%{DATE:date}, %{WA_TIME:time} - %{DATA:sender}: %{WA_CHAT:message}';
    var waSystem = '%{DATE:date}, %{WA_TIME:time} - %{WA_CHAT:message}';

    var waChatPattern = patterns.createPattern(waChat);
    var waSystemPattern = patterns.createPattern(waSystem);

    if (lastDate)
    {
      lastDate = lastDate.replace(' ', ', ');
      chatText = chatText.substr(chatText.indexOf(lastDate));
    }

    var conversations = chatText.split(/(?=[0-9]+\/[0-9]+\/[0-9]+, )/);
    var chats = [];
    var tempChat = '';
    var mergeChat = '';

    if (conversations.length <= 1) {
      callback(ERRORS.invalidFile);
    } else {
      conversations.forEach(function(chat, index) {
        mergeChat = tempChat + chat;

        if (chat.length == '1') {
          tempChat = '1';
        }
        else
        {
          var chatObj = waChatPattern.parseSync(mergeChat);

          if (chatObj == null)
            chatObj = waSystemPattern.parseSync(mergeChat);

          chats.push(chatObj);
          tempChat = '';
        }
      });

      callback(err, chats);
    }
  },

  read: function(chatFile, lastDate, callback) {
    if (typeof(lastDate) == 'function') {
      callback = lastDate;
      lastDate = null;
    }

    var err = null;

    fs.readFile(chatFile, 'utf-8', (err, text) => {
      if (err) {
        callback(err);
      } else {
        module.exports.parse(text, lastDate, (err, conversations) => {
          callback(err, conversations);
        });
      }
    });
  }
}
