var should = require('should'),
  wa = require('../src/wa-reader'),
  path = require('path'),
  fs = require('fs');

describe('wa-reader', function() {
  var chatFile = path.join(path.dirname(__filename), '/chats.txt');
  var notChatFile = path.join(path.dirname(__filename), '/not-wa-chats.txt');
  var oneLineChatFile = path.join(path.dirname(__filename), '/one-line-chats.txt');
  var chatFileNotExists = path.join(path.dirname(__filename), '/not-exists.txt');

  describe('parse', function() {
    var chatText = fs.readFileSync(chatFile, 'utf-8');
    var notChatText = fs.readFileSync(notChatFile, 'utf-8');
    var oneLineChatText = fs.readFileSync(oneLineChatFile, 'utf-8');

    it('should return an array', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations.should.be.instanceOf(Array);
        done();
      });
    });

    it('should return an array of last chats based on specific date & time', function(done) {
      wa.parse(chatText, '25/12/16 20:39', function(err, conversations) {
        conversations.length.should.be.equal(4);
        done();
      });
    });

    it('should return an array of object', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations.should.be.instanceOf(Object);
        done();
      });
    });

    it('should return an array of object with date key', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations[0].should.have.property('date');
        done();
      });
    });

    it('should return an array of object with time key', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations[0].should.have.property('time');
        done();
      });
    });

    it('should return an array of object with sender key', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations[1].should.have.property('sender');
        done();
      });
    });

    it('should return an array of object with chat key', function(done) {
      wa.parse(chatText, function(err, conversations) {
        conversations[1].should.have.property('message');
        done();
      });
    });

    it('should return error if text is not WhatsApp chat format', function(done) {
      wa.parse(notChatText, function(err, conversations) {
        err.should.have.property('code', 'INVALID_FILE');
        done();
      });
    });

    it('should return an array of object with chat key even if chats is only has one line chat', function(done) {
      wa.parse(oneLineChatText, function(err, conversations) {
        conversations[0].should.have.property('message');
        done();
      });
    });
  });

  describe('read', function() {
    it('should return an array', function(done) {
      wa.read(chatFile, function(err, conversations) {
        conversations.should.be.instanceOf(Array);
        done();
      });
    });

    it('should return error if file is not exists', function(done) {
      wa.read(chatFileNotExists, function(err, conversations) {
        err.should.have.property('code', 'ENOENT');
        done();
      });
    });

    it('should return error if file is not WhatsApp chat file', function(done) {
      wa.read(notChatFile, function(err, conversations) {
        err.should.have.property('code', 'INVALID_FILE');
        done();
      });
    });
  });
});
