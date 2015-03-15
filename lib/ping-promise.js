'use strict';

var sys = require('util');
var cp = require('child_process');
var os = require('os');
var Q = require('q');

/**
 * @param address string
 * @param config Object
 * @return q promise
 */
function probe(address, config) {

    var p = os.platform();
    var stdoutData = '';

    var deferred = Q.defer();

    var default_cfg = {
        'numeric': true,
        'timeout': 1,
        'replies': 1,
        'extra': []
    };

    config = config || default_cfg;

    var args = [];
    var ls;
    if (p === 'linux') {
        //linux
        args = [];
        if (config.numeric !== false) {
            args.push('-n');
        }
        if (config.timeout !== false) {
            args.push(sys.format('-w %d', config.timeout ? config.timeout : default_cfg.timeout));
        }
        if (config.replies !== false) {
            args.push(sys.format('-c %d', config.replies ? config.replies : default_cfg.replies));
        }
        if (config.extra !== false) {
            args = args.concat(config.extra ? config.extra : default_cfg.extra);
        }
        args.push(address);
        ls = cp.spawn('/bin/ping', args);
    } else if (p === 'darwin') {
        //mac osx
        args = [];
        if (config.numeric !== false) {
            args.push('-n');
        }
        if (config.timeout !== false) {
            args.push(sys.format('-t %d', config.timeout ? config.timeout : default_cfg.timeout));
        }
        if (config.replies !== false) {
            args.push(sys.format('-c %d', config.replies ? config.replies : default_cfg.replies));
        }
        if (config.extra !== false) {
            args = args.concat(config.extra ? config.extra : default_cfg.extra);
        }
        args.push(address);
        ls = cp.spawn('/sbin/ping', args);
    } else {

        deferred.reject(new Error('ping.probe is unsupported for this platform [' + p + ']'));
    }

    if (ls) {
        ls.on('error', function () {

            deferred.reject(new Error('ping.probe: there was an error while executing the ping program. check the path or permissions...'));
        });

        ls.stdout.on('data', function (data) {
            stdoutData += String(data);
        });

        ls.on('exit', function (code) {

            var result;

            // workaround for windows machines: if host is unreachable ping will return
            // a successful error code, so we need to handle this.
            if (p.match(/^win/)) {
                var lines = stdoutData.split('\n');
                result = false;
                for (var t = 0; t < lines.length; t++) {
                    if (lines[t].search(/TTL=[0-9]+/i) > 0) {
                        result = true;
                        break;
                    }
                }
            } else {
                result = (code === 0);
            }

            deferred.resolve({
                host: address,
                alive: result
            });
        });
    }

    return deferred.promise;
}

exports.probe = probe;
