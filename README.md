# <a href="http://peeracle.github.io"><img src="http://peeracle.github.io/img/logo.svg" height="96"></a>

**Peeracle** is an open-source solution that brings Peer-to-Peer video streaming to your website without requiring any plugins.

Written in ECMAScript 5 to ensure high compatibility for both Node and Web Browsers. A native SDK made in C++ including Java and Objective-C bindings is also available inside the [libpeeracle][libpeeracle-url] repository.

:warning: This **final study project** is currently feature incomplete and under heavy development. You can read [our roadmap][roadmap-url] and [follow us on Twitter][twitter-url] for updates. Pull requests are always appreciated!

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[libpeeracle-url]: https://github.com/peeracle/libpeeracle
[twitter-url]: https://twitter.com/peeracle
[roadmap-url]: https://trello.com/b/zlS2vtAS/peeracle-roadmap
[version-svg]: https://img.shields.io/npm/v/peeracle.svg?style=flat-square
[package-url]: https://npmjs.org/package/peeracle
[travis-svg]: https://img.shields.io/travis/peeracle/peeracle/dev.svg?style=flat-square
[travis-url]: https://travis-ci.org/peeracle/peeracle
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/peeracle.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=peeracle

## Setup

### CDN

We don't have a CDN yet, you can use rawgit for now :

```html
<script src="https://cdn.rawgit.com/peeracle/peeracle/dev/dist/peeracle-dev.js"></script>
```

### npm

Peeracle is also listed inside the official npm repository.

```
npm install peeracle
```

You can build the web version by running Grunt, the output file will be located inside the `dist` folder.

```
grunt
```

## Get Started

Here is a guide that will take you through the process of streaming your video in a peer-to-peer network with our library.

### Signaling Server

Setting up a signaling server is required in order to allow your viewers to connect between themselves and broadcast your content. You can quickly start a signaling server by using our sample located inside the `bin` folder :

```
node bin/tracker.js
```

This will start a signaling server which will listen to the host `127.0.0.1` and port `8080` by default. You can change the listening host and port by specifying these with the `-h` and `-p` options.

```
node bin/tracker.js -h 192.168.45.7 -p 9000
```

### Encode your media

Your content must be encoded and fragmented properly to fit the web browsers requirements. Here is a list of supported codecs at the time of writing.

| Format | Video    | Audio  |
|--------|----------|--------|
| MP4    | H264     | AAC    |
| WebM   | VP8, VP9 | Vorbis |

We will cover the steps required to encode videos with ffmpeg.

#### MP4

Run the following command :

```
ffmpeg -i movie.avi -c:v libx264 -b:v 8000k -bf 2 -g 90 -sc_threshold 0 \
       -c:a aac -strict experimental -b:a 96k -ar 44100 movie.mp4
```

| Parameter | Description              | Notes                                       |
|-----------|--------------------------|---------------------------------------------|
| -c:v      | Video codec              |                                             |
| -b:v      | Video variable bitrate   | 8000k is recommended for 1080p resolutions. |
| -g        | GOP size                 | 90 is recommended for 30 FPS.               |
| -c:a      | Audio codec              |                                             |
| -b:a      | Audio variable bitrate   |                                             |
| -ar       | Audio sampling frequency |                                             |

You must fragment the MP4 video into the ISOBMFF format so it can be played from web browsers, the MP4Box tool is required. You'll simply have to run the following command.

```
MP4Box -dash 3000 -rap -profile dashavc264:onDemand movie.mp4
```

A file named movie_dashinit.mp4 will be generated, you will have to use that one from now.

#### WebM

Run the following command :

```
ffmpeg -i movie.avi -c:v libvpx -b:v 8000k -tile-columns 4 -frame-parallel 1 \
       -keyint_min 150 -g 150 -f webm -dash 1 -c:a libvorbis -b:a 64K movie.webm
```

You have to remux the WebM video with the sample_muxer tool located inside [the libwebm repository][libwebm-url].

```
sample_muxer -i movie.webm -o movie_muxed.webm -output_cues 1 -cues_before_clusters 1
```

A file named movie_muxed.webm will be generated, you will have to use that one from now.

[libwebm-url]: https://github.com/webmproject/libwebm

### Create a metadata file

Your viewers will need to retrieve the metadata file. This file contains every details about the video they'll receive, including checksums to make sure that each part of the video has been received correctly.

You can create a metadata file by using our sample located inside the `bin` folder :

```
node bin/create-metadata.js -t 127.0.0.1:8080 movie.mp4 movie.peeracle
```

The tracker server URL must be specified with the `-t` parameter. `movie.mp4` is the video used to create a metadata file, and `movie.peeracle` is the name you would like to give to your generated metadata file.

### Start broadcasting

Now that you've got the video file with it's metadata file, you can start broadcasting it with Peeracle, with the sample located inside the `bin` folder :

```
node bin/seed.js -m movie.mp4 movie.peeracle
```

You can specify the video file made from the metadata file with the `-m` option. The checksums will be recalculated in order to make sure that the video file matches correctly with the metadata file. If the verification goes wrong, the client will join the peer-to-peer network as a receiver.

If you just want to receive the video, you can omit the `-m` parameter.

```
node bin/seed.js movie.peeracle
```

### Watch

People can now receive your broadcast from a website. Check out our demo located at the [peeracle-web-demo][peeracle-web-demo-url] repository. It contains a page made with AngularJS with a simple video player, you just have to change the metadata file path inside the `views/webmvideo/view.html` file.

![Demo preview][peeracle-web-demo-preview-img-url]

[peeracle-web-demo-url]: https://github.com/peeracle/peeracle-web-demo
[peeracle-web-demo-preview-img-url]: http://peeracle.github.io/img/demo-screenshot.png

## Contributing

Feel free to open an issue if you wish to discuss a new feature or ask a question. We accept pull requests, don't forget to put your name and e-mail address inside the AUTHORS file! You may also discuss on Twitter with [@Peeracle][twitter-url].
