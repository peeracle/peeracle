# <a href="http://peeracle.org"><img src="http://peeracle.org/img/logo.svg" height="96"></a>

**Peeracle** is an open-source solution that brings Peer-to-Peer video streaming to your website without requiring any plugins.

Written in ECMAScript 5 to ensure high compatibility for both Node and Web Browsers. A native SDK made in C++ including Java and Objective-C bindings is also available inside the [libpeeracle][libpeeracle-url] repository.

This project is currently feature incomplete and under heavy development. You can read [our roadmap][roadmap-url] and [follow us on Twitter][twitter-url] for updates. Pull requests are always appreciated!

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
