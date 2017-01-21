'use strict';

var assert = require('assert');
var sinon = require('sinon');
var PassThrough = require('stream').PassThrough;
var clone = require('clone');
var TimingStream = require('../speech-to-text/timing-stream.js');

var message = require('./resources/results.json');
var messages = require('./resources/car_loan_stream.json');

describe('TimingStream', function() {

  var clock;
  beforeEach(function() {
    clock = sinon.useFakeTimers();
  });

  afterEach(function() {
    clock.restore();
  });

  function nextTick(cb) {
    process.nextTick(cb); // for node
    clock.tick(1); // for browsers (where process.next tick is actually setTimeout 0)
  }

  it('should delay results w/ emitAt: START', function(done) {
    var stream = new TimingStream({objectMode: true, emitAt: TimingStream.START});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    assert.equal(stream.nextTick, null, 'nextTick should not yet be set');

    stream.write(message);
    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(2320); // 2.32 seconds - just before the end of the first word

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'thunderstorms could produce large hail isolated tornadoes and heavy rain ');

      done();
    });
  });

  it('should delay results w/ emitAt: END', function(done) {
    var stream = new TimingStream({objectMode: true, emitAt: TimingStream.END});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    assert.equal(stream.nextTick, null, 'nextTick should not yet be set');

    stream.write(message);
    nextTick(function() { // write is always async (?)

      clock.tick(2 * 1000); // first word is at 1.48s

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(5 * 1000); // last word ends at 6.14s (4.14 after previous tick)

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'thunderstorms could produce large hail isolated tornadoes and heavy rain ');

      done();
    });
  });

  it('should delay results longer when options.emitAt == TimingStream.END', function(done) {
    var stream = new TimingStream({objectMode: true, emitAt: TimingStream.END});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    assert.equal(stream.nextTick, null, 'nextTick should not yet be set');

    stream.write(message);
    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(2320); // 2.32 seconds - just before the end of the first word

      assert.equal(actual.length, 0);

      clock.tick(6140 - 2320); // 6.141 seconds (total) - end of the last word

      var lastResult = actual[actual.length - 1].results[0];

      assert.equal(lastResult.alternatives[0].transcript, 'thunderstorms could produce large hail isolated tornadoes and heavy rain ');
      assert.equal(lastResult.final, true, 'the end result should still be final');

      done();
    });
  });

  it('should fire end and close events when end comes quickly', function(done) {
    var source = new PassThrough({objectMode: true});
    var stream = new TimingStream({objectMode: true});
    source.pipe(stream);
    stream.on('data', function() {}); // put it into flowing mode so that 'end' fires
    stream.on('error', done);
    var closeFired = false;
    var endFired = false;
    stream.on('close', function() {
      closeFired = true;
    });
    stream.on('end', function() {
      endFired = true;
    });

    source.end(message);
    nextTick(function() { // write is always async (?)

      clock.tick(6140); // 6.140 seconds - end of the last word

      clock.tick(1); // give it a chance to actually emit a result
      assert(stream.nextTick === null, 'nextTick should be null');

      nextTick(function() { // async again
        assert(stream.sourceEnded, 'sourceEnded should be true');
        assert(closeFired, 'close event should be fired');
        assert(endFired, 'end event should be fired');
        done();
      });

    });
  });

  it('should fire end and close events when end comes slowly', function(done) {
    var source = new PassThrough({objectMode: true});
    var stream = new TimingStream({objectMode: true});
    source.pipe(stream);
    stream.on('data', function() {}); // put it into flowing mode so that 'end' fires
    stream.on('error', done);
    var closeFired = false;
    var endFired = false;
    stream.on('close', function() {
      closeFired = true;
    });
    stream.on('end', function() {
      endFired = true;
    });

    source.write(message);
    nextTick(function() { // write is always async (?)

      clock.tick(6140); // 6.140 seconds - end of the last word

      clock.tick(100); // give it a chance to actually emit another result

      source.end();

      nextTick(function() { // node again
        assert(stream.nextTick === null, 'nextTick should be null');
        assert(stream.sourceEnded, 'sourceEnded should be true');
        assert(closeFired, 'close event should be fired');
        nextTick(function() { // and, one more async in this case
          assert(endFired, 'end event should be fired');
          done();
        });
      });
    });
  });

  it('should .stop() when told to w/ emitAt: START', function(done) {
    var stream = new TimingStream({objectMode: true, emitAt: TimingStream.START});

    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    var stopFired = false;
    stream.on('stop', function() {
      stopFired = true;
    });

    var finalMessages = require('./resources/self_employed_stream.json').filter(function(m) {
      return m.results && m.results[0].final;
    });
    stream.write(finalMessages[0]);
    stream.write(finalMessages[1]);

    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(1000); // into the first result

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'so how are you doing these days things are going very well glad to hear ');

      stream.stop();

      assert(stopFired, 'stop event should have fired');

      stream.write(finalMessages[2]);
      nextTick(function() {
        clock.tick(14 * 1000);
        assert.equal(actual.length, 1, 'no more results should be emitted after stop');

        clock.tick(30 * 1000);
        stream.write(finalMessages[3]);
        nextTick(function() {
          assert.equal(actual.length, 1, 'no more results should be emitted after stop, even if past due at writing time');

          stream.end();
          nextTick(function() {
            assert.equal(actual.length, 1, 'no more results should be emitted after stop, even if source ends');
          });
        });
      });

      clock.tick(35 * 1000); // past the end of the final result


      done();
    });
  });

  it('should .stop() when told to w/ emitAtt: EMD', function(done) {
    var stream = new TimingStream({objectMode: true, emitAt: TimingStream.END});

    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    var stopFired = false;
    stream.on('stop', function() {
      stopFired = true;
    });

    var finalMessages = require('./resources/self_employed_stream.json').filter(function(m) {
      return m.results && m.results[0].final;
    });
    stream.write(finalMessages[0]);
    stream.write(finalMessages[1]);

    nextTick(function() { // write is always async (?)

      assert.equal(actual.length, 0);
      assert(stream.nextTick !== null, 'nextTick should be set');

      clock.tick(5 * 1000); // first result ends at 4.16

      assert.equal(actual.length, 1);
      assert.equal(actual[0].results[0].alternatives[0].transcript, 'so how are you doing these days things are going very well glad to hear ');

      stream.stop();

      assert(stopFired, 'stop event should have fired');

      stream.write(finalMessages[2]);
      nextTick(function() {
        clock.tick(14 * 1000);
        assert.equal(actual.length, 1, 'no more results should be emitted after stop');

        clock.tick(30 * 1000);
        stream.write(finalMessages[3]);
        nextTick(function() {
          assert.equal(actual.length, 1, 'no more results should be emitted after stop, even if past due at writing time');

          stream.end();
          nextTick(function() {
            assert.equal(actual.length, 1, 'no more results should be emitted after stop, even if source ends');
          });
        });
      });

      clock.tick(35 * 1000); // past the end of the final result


      done();
    });
  });

  it('should not emit interim results after the final result for a given index', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    messages.forEach(function(msg) {
      if (msg.results) {
        stream.write(msg);
      }
    });
    stream.end();

    clock.tick(37.26 * 1000);

    nextTick(function() { // write is always async (?)
      assert(actual.length);
      actual.reduce(function(lastIndex, msg) {
        assert.equal(msg.result_index, lastIndex, 'wrong index on result, expecting ' + lastIndex + ' got ' + JSON.stringify(msg, null, 2));
        // index should always increment after a final message
        return (msg.results[0].final) ? lastIndex + 1 : lastIndex;
      }, 0);

      done();
    });
  });

  it('should pass through speaker_labels after the matching final results', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    messages.forEach(function(msg) {
      stream.write(msg);
    });
    stream.end();

    clock.tick(37.26 * 1000);

    nextTick(function() { // write is always async (?)

      var wasFinal = false;
      var endTime = 0;
      var speakerLabelsMessages = 0;
      actual.forEach(function(msg) {
        if (msg.speaker_labels) {
          speakerLabelsMessages++;
          assert(wasFinal, 'message preceding speaker_labels message was final');
          var spealerLabelsEndTime = msg.speaker_labels[msg.speaker_labels.length - 1].to;
          assert.equal(spealerLabelsEndTime, endTime);
        } else {
          wasFinal = msg.results[0].final;
          var timestamps = msg.results[0].alternatives[0].timestamps;
          endTime = timestamps[timestamps.length - 1][2];
        }
      });

      assert.equal(speakerLabelsMessages, 3);

      done();
    });
  });

  it('should not emit the same transcript twice', function(done) {
    var stream = new TimingStream({objectMode: true});
    var actual = [];
    stream.on('data', function(timedResult) {
      actual.push(timedResult);
    });
    stream.on('error', done);

    messages.forEach(function(msg) {
      if (msg.results) {
        stream.write(msg);
      }
    });

    clock.tick(37.26 * 1000);

    nextTick(function() { // write is always async (?)

      var lastTranscript = '';
      actual.forEach(function(msg) {
        var transcript = msg.results[0].alternatives[0].transcript;
        var final = msg.results[0].final;
        // a final result  may have the same text as the previous result (regardless of weather the previous was interim or final)
        if (!final) {
          assert.notEqual(transcript, lastTranscript);
          assert.notEqual(transcript.trim(), lastTranscript.trim());
        }
        lastTranscript = transcript;
      });

      done();
    });
  });

  it('should error if given results with no timestamps', function(done) {
    var noTimestamps = require('../speech-to-text/no-timestamps');
    assert(noTimestamps.ERROR_NO_TIMESTAMPS, 'noTimestamps.ERROR_NO_TIMESTAMPS should be defined');
    var stream = new TimingStream({objectMode: true});
    var noTsMessage = clone(message);
    delete noTsMessage.results[0].alternatives[0].timestamps;
    stream.on('data', function(data) {
      assert.fail(data, null, 'data emitted');
    });
    stream.on('error', function(err) {
      assert.equal(err.name, noTimestamps.ERROR_NO_TIMESTAMPS);
      done();
    });
    stream.end(noTsMessage);
  });

});
