'use strict';

var sys = require('util');
var cp = require('child_process');
var os = require('os');
var Q = require('q');
var _ = require('lodash');

/**
 *
 * @param address
 * @param config
 * @param callback
 * @returns {ping.promise|*|promise|Q.promise}
 */
exports.probe = function probe(address, config, callback) {

    var p = os.platform();

    var deferred = Q.defer();
    var promise = deferred.promise;
    deferred.promise.nodeify(callback);

    var defaultConfig = {
        numeric: true,
        timeout: 1,
        replies: 1,
        extra: []
    };

    config = _.merge(defaultConfig, config || {});

    var args = [];
    var ls;
    var executionStartTime;

    if (p === 'linux') {
        //linux
        args = [];
        if (config.numeric === true) {
            args.push('-n');
        }
        args.push(sys.format('-w %d', config.timeout));
        args.push(sys.format('-c %d', config.replies));
        args = args.concat(config.extra);
        args.push(address);

        executionStartTime = new Date();
        ls = cp.spawn('/bin/ping', args);
    } else if (p === 'darwin') {
        //mac osx
        args = [];
        if (config.numeric === true) {
            args.push('-n');
        }
        args.push(sys.format('-t %d', config.timeout));
        args.push(sys.format('-c %d', config.replies));
        args = args.concat(config.extra);
        args.push(address);

        executionStartTime = new Date();
        ls = cp.spawn('/sbin/ping', args);
    } else {

        deferred.reject(new Error('icmp is unsupported for this platform [' + p + ']'));
    }

    if (ls) {
        ls.on('error', function () {

            deferred.reject(new Error('icmp: there was an error while executing the ping program. check the path or permissions...'));
        });

        ls.on('exit', function (code) {

            deferred.resolve({
                host: address,
                alive: code === 0,
                time: new Date() - executionStartTime
            });
        });
    }

    return promise;
};
