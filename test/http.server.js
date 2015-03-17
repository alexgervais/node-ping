'use strict';

module.exports = function (expectations) {

    var http = require('http');
    var auth = require('http-auth');
    var basic = auth.basic({realm: 'test'}, function (username, password, callback) {
            callback(username === 'a-valid-username' && password === 'with-password');
        }
    );

    var server = http.createServer(basic, function (req, res) {

        var expectedStatusCode = expectations[req.url];

        if (expectedStatusCode) {
            res.writeHead(expectedStatusCode, {'Content-Type': 'text/plain'});
            res.end('Hello, world!');
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.end('Not Found');
        }
    });

    return {

        listen: function () {

            server.listen.apply(server, arguments);
        },

        close: function (callback) {

            server.close(callback);
        }
    };
};
