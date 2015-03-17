'use strict';

var Q = require('q');
var _ = require('lodash');
var app = require('../package.json');

var needle = require('needle');
needle.defaults({
    follow: 10,
    follow_set_cookies: false,
    follow_set_referer: true,
    follow_keep_method: true,
    follow_if_same_host: false,
    follow_if_same_protocol: false,
    multipart: false,
    headers: false,
    auth: 'auto',
    json: false,
    decode_response: false,
    parse_response: false,
    compressed: false,
    accept: '*/*',
    connection: 'close',
    rejectUnauthorized: true,
    user_agent: 'Mozilla/5.0 (compatible; ' + app.name + '/' + app.version + '; ' + app.homepage + ')'
});

exports.probe = function probe(address, options, callback) {

    var deferred = Q.defer();
    var promise = deferred.promise;
    deferred.promise.nodeify(callback);

    var supportedOptions = ['username', 'password', 'timeout'];
    var optionsDefaultValues = {
        timeout: 1800
    };

    options = _.merge(optionsDefaultValues, options || {});
    options = _.pick(options, supportedOptions);

    var executionStartTime = new Date();

    // TODO, Support GET or HEAD

    needle.get(address, options, function (error, response) {

        return deferred.resolve({
            host: address,
            alive: !error && response.statusCode >= 200 && response.statusCode < 300,
            time: new Date() - executionStartTime
        });
    });

    return promise;
};
