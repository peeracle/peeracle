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

module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    banner: '/*\n' +
    ' * Copyright (c) 2015 peeracle contributors\n' +
    ' *\n' +
    ' * Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
    ' * of this software and associated documentation files (the "Software"), to deal\n' +
    ' * in the Software without restriction, including without limitation the rights\n' +
    ' * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
    ' * copies of the Software, and to permit persons to whom the Software is\n' +
    ' * furnished to do so, subject to the following conditions:\n' +
    ' *\n' +
    ' * The above copyright notice and this permission notice shall be included in\n' +
    ' * all copies or substantial portions of the Software.\n' +
    ' *\n' +
    ' * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
    ' * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
    ' * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
    ' * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
    ' * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
    ' * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\n' +
    ' * SOFTWARE.\n' +
    ' */\n',

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },

    jsdoc : {
      dist : {
        src: ['src/*.js'],
        jsdoc: './node_modules/jsdoc/jsdoc.js',
        options: {
          destination: 'doc'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>\n' +
        '\'use strict\';\n\n' +
        '(function(){\n' +
        'var Peeracle = {};\n',

        footer: 'window.Peeracle = Peeracle;\n})();\n',

        process: function (src, filepath) {
          return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\n/g, '$1');
        },
        stripBanners: true
      },
      dist: {
        src: [
          'src/listenable.js',
          'src/dataStream.js',
          'src/fileDataStream.js',
          'src/httpDataStream.js',
          'src/memoryDataStream.js',
          'src/hash.js',
          'third_party/murmurHash3.js/murmurHash3.js',
          'src/murmur3Hash.js',
          'src/media.js',
          'src/isobmffMedia.js',
          'src/webmMedia.js',
          'src/storage.js',
          'src/mediaStorage.js',
          'src/memoryStorage.js',
          'src/metadataStream.js',
          'src/metadata.js',
          'src/trackerMessage.js',
          'src/peerMessage.js',
          'src/peerConnection.js',
          'src/peer.js',
          'src/trackerClient.js',
          'src/session.js',
          'src/sessionHandle.js'
        ],
        dest: 'dist/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    preprocess: {
      inline: {
        src: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
        options: {
          inline: true,
          context: {
            DEBUG: false
          }
        }
      }
    },

    jsbeautifier: {
      files: ['dist/<%= pkg.name %>-<%= pkg.version %>.js'],
      options: {
        js: {
          braceStyle: "collapse",
          breakChainedMethods: false,
          e4x: false,
          evalCode: false,
          indentChar: " ",
          indentLevel: 0,
          indentSize: 2,
          indentWithTabs: false,
          jslintHappy: false,
          keepArrayIndentation: false,
          keepFunctionIndentation: false,
          maxPreserveNewlines: 2,
          preserveNewlines: true,
          spaceBeforeConditional: true,
          spaceInParen: false,
          unescapeStrings: false,
          wrapLineLength: 80,
          endWithNewline: true
        }
      }
    },

    eslint: {
      target: ['src/*.js']
    },

    'closure-compiler': {
      frontend: {
        closurePath: '.',
        js: [
          'dist/<%= pkg.name %>-<%= pkg.version %>.js',
          'exports.js'
        ],
        jsOutputFile: 'dist/<%= pkg.name %>-<%= pkg.version %>.min.js',
        maxBuffer: 500,
        options: {
          compilation_level: 'ADVANCED_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5_STRICT'
        }
      },
      frontend_debug: {
        closurePath: '.',
        js: 'dist/<%= pkg.name %>-<%= pkg.version %>.js',
        jsOutputFile: 'dist/<%= pkg.name %>-<%= pkg.version %>.debug.js',
        options: {
          debug: true,
          formatting: 'PRETTY_PRINT'
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-preprocess');

  grunt.registerTask('default', ['eslint', 'concat', 'preprocess', 'jsbeautifier'/*, 'closure-compiler'*/]);
  grunt.registerTask('test', ['karma']);
  grunt.registerTask('doc', ['jsdoc']);
};
