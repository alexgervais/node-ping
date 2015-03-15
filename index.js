'use strict';

var ping = {};

ping.sys = require('./lib/ping-sys');
ping.promise = require('./lib/ping-promise');

module.exports = ping;
