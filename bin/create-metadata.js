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

var Peeracle = require('..');
var program = require('commander');

function list(val) {
  return val.split(',');
}

program
  .version('0.0.1')
  .usage('[options] <mediaFile> <metadataFile>')
  .option('-t, --trackers <urls,...>', 'Add [urls] to the trackers list', list)
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(1);
}

var mediaFileName = program.args[0];
var metadataFileName = program.args[1];

try {
  var mediaFileStream = new Peeracle.FileDataStream({
    path: mediaFileName
  });
} catch (e) {
  console.log('Can\'t open the media file:', e.message);
  process.exit(1);
}

try {
  var metadataFileStream = new Peeracle.FileDataStream({
    path: metadataFileName,
    mode: 'w+'
  });
} catch (e) {
  console.log('Can\'t open the metadata file:', e.message);
  process.exit(1);
}

var media;
Peeracle.Media.loadFromDataStream(mediaFileStream,
  function loadFromDataStreamCallback(error, instance) {
    if (error) {
      console.log(error.message);
      return;
    }

    media = instance;
    var metadata = new Peeracle.Metadata();

    if (!program.trackers || !program.trackers.length) {
      program.trackers = ['ws://127.0.0.1:8080'];
    }

    for (var i = 0, l = program.trackers.length; i < l; ++i) {
      metadata.addTrackerUrl(program.trackers[i]);
    }

    metadata.addMedia(media, function (error) {
      if (error) {
        console.log(error.message);
        return;
      }

      metadata.serialize(metadataFileStream, function (error) {
        if (error) {
          console.log(error.message);
          return;
        }

        metadataFileStream.close();
        mediaFileStream.close();
      });
    });
  });
