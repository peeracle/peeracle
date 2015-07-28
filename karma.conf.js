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

module.exports = function (config) {
  'use strict';
  config.set({
    basePath: './',

    files: [
      {
        pattern: 'dist/peeracle-0.0.2.js',
        included: true
      },
      'dist/peeracle-0.0.2.js',
      'spec/**/*-spec.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'/*, 'express-http-server'*/],

    browsers: ['Chrome', 'Firefox'],

    plugins: [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-jasmine',
      'karma-coverage',
      'karma-verbose-reporter',
      // 'karma-express-http-server'
    ],

    reporters: ['verbose', 'coverage'],

    preprocessors: {
      'dist/peeracle-0.0.2.js': ['coverage']
    },

    coverageReporter: {
      type: 'html',
      dir: 'coverage/browser'
    },

    /*expressHttpServer: {
      port: 3000,
      // this function takes express app object and allows you to modify it
      // to your liking. For more see http://expressjs.com/4x/api.html
      appVisitor: function appVisitor(app, log) {
        var bytes = new Uint8Array([26, 69, 223, 163, 159, 66, 134, 129, 1,
          66, 247, 129, 1, 66, 242, 129, 4, 66, 243, 129,
          8, 66, 130, 132, 119, 101, 98, 109, 66, 135, 129,
          2, 66]);
        var length = bytes.length;

        app.use(function appUse(req, res, next) {
          res.header('Access-Control-Allow-Origin', '*');
          res.header('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
          res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Range, Content-Type');
          res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Range');
          next();
        });

        app.head('/', function appHead(req, res) {
          res.header('Content-Length', length);

          res.status(200).end();
        });

        app.get('/', function appGet(req, res) {
          var rangeStr = req.get('Range');
          if (!rangeStr) {
            res.header('Content-Type', 'application/octet-stream');
            res.header('Content-Length', length);
            res.status(200).send(new Buffer(bytes));
            return;
          }

          var range = rangeStr.substr(6, rangeStr.length - 6);
          var min = parseInt(range.split('-')[0], 10);
          var max = parseInt(range.split('-')[1], 10) + 1;
          var result = bytes.subarray(min, max);

          res.header('Content-Type', 'application/octet-stream');
          res.header('Content-Length', max - min);
          res.header('Content-Range', 'bytes ' + range + '/' + length);

          res.status(206).send(new Buffer(result));
        });

        app.options('/', function appOptions(req, res) {
          res.header('Content-Length', length);

          res.status(200).send(null);
        });

        app.use(function notFound(req, res) {
          res.status(404).end();
        });
      }
    },*/

    singleRun: true
  });
};
