'use strict';

var ping = require('./ping-promise');

/**
 * @param address string
 * @param callback function (err, data)
 */
function probe(address, callback) {

    callback = callback || function () {};

    ping.probe(address)
        .then(function (data) {
            callback(null, data.alive);
        })
        .fail(function (err) {
            callback(err);
        });
}

exports.probe = probe;
