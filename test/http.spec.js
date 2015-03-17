'use strict';

var expect = require('expect.js');

describe('http:', function () {

    var ping;
    var options;
    var httpServer;

    before(function (done) {

        process.env.NODE_ENV = 'test';
        // process.env.DEBUG = true;

        done();
    });

    after(function (done) {

        done();
    });

    beforeEach(function (done) {

        ping = require('../index');
        options = {
            username: 'abc',
            password: 'def',
            timeout: 4000
        };

        httpServer = require('./http.server')(
            {'/some_path?variable&query=true': 200}
        );
        httpServer.listen(9999);

        done();
    });

    afterEach(function (done) {

        httpServer.close();
        done();
    });

    describe('callback:', function () {

        it('should ping 127.0.0.1:9999/some_path?variable&query=true successfully', function (done) {

            ping.http.probe('127.0.0.1:9999/some_path?variable&query=true',
                {username: 'a-valid-username', password: 'with-password'},
                function (err, data) {

                    expect(err).to.be(null);

                    expect(data.host).to.be('127.0.0.1:9999/some_path?variable&query=true');
                    expect(data.alive).to.be(true);
                    expect(data.time).to.be.greaterThan(0);
                    expect(data.time).to.be.lessThan(1800);

                    done();
                });
        });

        it('should ping 127.0.0.1:9999/some_path?variable&query=true with no supplied credentials', function (done) {

            ping.http.probe('127.0.0.1:9999/some_path?variable&query=true', {},
                function (err, data) {

                    expect(err).to.be(null);

                    expect(data.host).to.be('127.0.0.1:9999/some_path?variable&query=true');
                    expect(data.alive).to.be(false);
                    expect(data.time).to.be.greaterThan(0);
                    expect(data.time).to.be.lessThan(1800);

                    done();
                });
        });

        it('should ping 127.0.0.1:9999 successfully, but return a 404', function (done) {

            ping.http.probe('127.0.0.1:9999',
                {username: 'a-valid-username', password: 'with-password'},
                function (err, data) {

                    expect(err).to.be(null);

                    expect(data.host).to.be('127.0.0.1:9999');
                    expect(data.alive).to.be(false);
                    expect(data.time).to.be.greaterThan(0);
                    expect(data.time).to.be.lessThan(1800);

                    done();
                });
        });

        it('should ping https://www.google.com successfully', function (done) {

            ping.http.probe('https://www.google.com', {}, function (err, data) {

                expect(err).to.be(null);

                expect(data.host).to.be('https://www.google.com');
                expect(data.alive).to.be(true);
                expect(data.time).to.be.greaterThan(0);
                expect(data.time).to.be.lessThan(1800);

                done();
            });
        });

        it('should not be able to ping unknownhost.local', function (done) {

            ping.http.probe('unknownhost.local', {}, function (err, data) {

                expect(err).to.be(null);

                expect(data.host).to.be('unknownhost.local');
                expect(data.alive).to.be(false);
                expect(data.time).to.be.greaterThan(1000);

                done();
            });
        });
    });

    describe('promise:', function () {

        it('should ping 127.0.0.1:9999/some_path?variable&query=true successfully', function (done) {

            ping.http.probe('127.0.0.1:9999/some_path?variable&query=true',
                {username: 'a-valid-username', password: 'with-password'})
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1:9999/some_path?variable&query=true');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1800);

                    done();
                })
                .done();
        });

        it('should ping https://www.google.com successfully', function (done) {

            ping.http.probe('https://www.google.com')
                .then(function (result) {

                    expect(result.host).to.be('https://www.google.com');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1800);

                    done();
                })
                .done();
        });

        it('should not be able to ping unknownhost.local', function (done) {

            ping.http.probe('unknownhost.local')
                .then(function (result) {

                    expect(result.host).to.be('unknownhost.local');
                    expect(result.alive).to.be(false);

                    expect(result.time).to.be.greaterThan(1000);

                    done();
                })
                .done();
        });
    });

    describe('promise, with options:', function () {

        it('should ping 127.0.0.1:9999/some_path?variable&query=true successfully', function (done) {

            this.timeout(5000);

            options.username = 'a-valid-username';
            options.password = 'with-password';

            ping.http.probe('127.0.0.1:9999/some_path?variable&query=true', options)
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1:9999/some_path?variable&query=true');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1800);

                    done();
                })
                .done();
        });

        it('should ping https://www.google.com successfully', function (done) {

            this.timeout(5000);

            ping.http.probe('https://www.google.com', options)
                .then(function (result) {

                    expect(result.host).to.be('https://www.google.com');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1800);

                    done();
                })
                .done();
        });

        it('should not be able to ping unknownhost.local', function (done) {

            this.timeout(5000);

            ping.http.probe('unknownhost.local', options)
                .then(function (result) {

                    expect(result.host).to.be('unknownhost.local');
                    expect(result.alive).to.be(false);

                    expect(result.time).to.be.greaterThan(4000);

                    done();
                })
                .done();
        });
    });
});
