'use strict';

var ping = {};

ping.icmp = require('./lib/icmp');
ping.http = require('./lib/http');

module.exports = ping;
