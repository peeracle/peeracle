/*
 * Copyright (c) 2015 peeracle contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-disable */

'use strict';

var fs = require('fs');
var Peeracle = require('..');
var program = require('commander');

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .usage('<mediaFile>')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

var mediaFileName = program.args[0];

try {
  var mediaFileStream = new Peeracle.FileDataStream({
    path: mediaFileName
  });
} catch (e) {
  console.log('Can\'t open the media file:', e.message);
  process.exit(1);
}

/** @type {Peeracle.Media} */
var media;
Peeracle.Media.loadFromDataStream(mediaFileStream,
  function loadFromDataStreamCallback(error, instance) {
    if (error) {
      console.log(error.message);
      return;
    }

    media = instance;
    media.getInitSegment(function (err, initSegment) {
      var cues = media.cues;
      var cue;
      var i = 0;
      var l = cues.length;

      fs.writeFileSync('init.segment', new Buffer(initSegment));

      cue = cues[i];
      media.getMediaSegment(cue.timecode, function mediaSegmentCb(err, mediaSegment) {
        if (err) {
          throw err;
        }
        fs.writeFileSync('media_' + ('0000' + i).substr(-4,4) + '.segment', new Buffer(mediaSegment));
        if (i <= l) {
          cue = cues[++i];
          media.getMediaSegment(cue.timecode, mediaSegmentCb);
        }
      });
    });
  });
