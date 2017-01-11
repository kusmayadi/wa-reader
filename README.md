[![Build Status](https://travis-ci.org/kusmayadi/wa-reader.svg?branch=master)](https://travis-ci.org/kusmayadi/wa-reader)

# wa-reader
Utility for reading WhatsApp chat file

## Install via NPM

	npm install wa-reader

## Usage

### read(filename, callback);

Read and parse WhatsApp backup chat file. It will return JSON object.

	var wa = require('wa-reader');

	var chatFile = path.join(path.dirname(__filename), '/backup-chats.txt');
	wa.read(chatFile, function(err, chats) {
		chats.forEach(function(chat) {
			process.stdout.write('date: ' + chat.date + "\n");
			process.stdout.write('time: ' + chat.time + "\n");
			process.stdout.write('sender: ' + chat.sender + "\n");
			process.stdout.write('chat: ' + chat.chat + "\n");
		});
	});

### parse(text, callback);

var wa = require('wa-reader');

Parse text from WhatsApp backup chat file. It will return JSON object.

	var chatFile = path.join(path.dirname(__filename), '/backup-chats.txt');
	wa.parse(chatText, function(err, chats) {
		chats.forEach(function(chat) {
			process.stdout.write('date: ' + chat.date + "\n");
			process.stdout.write('time: ' + chat.time + "\n");
			process.stdout.write('sender: ' + chat.sender + "\n");
			process.stdout.write('chat: ' + chat.chat + "\n");
		});
	});

## Return JSON Object
Both `read()` and `parse()` function will return an array of JSON object with the following format:

	[
		{
			date: '31/1/16',
			time: '07:22',
			sender: 'John Doe',
			message: 'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.'
		}
	]

If no *sender* property return on the object, the message is sent by system.
