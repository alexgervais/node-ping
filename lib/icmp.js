'use strict';

var Q = require('q');
var _ = require('lodash');

var sys = require('util');
var cp = require('child_process');
var os = require('os');

exports.probe = function probe(address, options, callback) {

    var p = os.platform();

    var deferred = Q.defer();
    var promise = deferred.promise;
    deferred.promise.nodeify(callback);

    var supportedOptions = ['numeric', 'timeout', 'replies', 'extra'];
    var optionsDefaultValues = {
        numeric: true,
        timeout: 1,
        replies: 1,
        extra: []
    };

    options = _.merge(optionsDefaultValues, options || {});
    options = _.pick(options, supportedOptions);

    var args = [];
    var ls;
    var executionStartTime;

    if (p === 'linux') {
        //linux
        args = [];
        if (options.numeric === true) {
            args.push('-n');
        }
        args.push(sys.format('-w %d', options.timeout));
        args.push(sys.format('-c %d', options.replies));
        args = args.concat(options.extra);
        args.push(address);

        executionStartTime = new Date();
        ls = cp.spawn('/bin/ping', args);
    } else if (p === 'darwin') {
        //mac osx
        args = [];
        if (options.numeric === true) {
            args.push('-n');
        }
        args.push(sys.format('-t %d', options.timeout));
        args.push(sys.format('-c %d', options.replies));
        args = args.concat(options.extra);
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
