'use strict';

var expect = require('expect.js');
var sinon = require('sinon');

describe('icmp:', function () {

    var ping;
    var options;

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
            numeric: false,
            timeout: 4,
            extra: ['-i', '2']
        };

        done();
    });

    afterEach(function (done) {

        done();
    });

    describe('callback:', function () {

        it('should ping 127.0.0.1 successfully', function (done) {

            ping.icmp.probe('127.0.0.1', {}, function (err, data) {

                expect(err).to.be(null);

                expect(data.host).to.be('127.0.0.1');
                expect(data.alive).to.be(true);
                expect(data.time).to.be.greaterThan(0);
                expect(data.time).to.be.lessThan(1000);

                done();
            });
        });

        it('should ping 127.0.0.1 with error; mocking unsupported platform', function (done) {

            var os = require('os');
            var osMock = sinon.mock(os);
            osMock.expects('platform').once().returns('Windowz');

            ping.icmp.probe('127.0.0.1', {}, function (err, data) {

                osMock.verify();
                osMock.restore();

                expect(err).to.be.a(Error);
                expect(err.message).to.be('icmp is unsupported for this platform [Windowz]');

                expect(data).to.be(undefined);

                done();
            });
        });

        it('should ping 127.0.0.1 with process execution error; mocking other platform', function (done) {

            var os = require('os');

            var otherPlatform = os.platform() === 'linux' ? 'darwin' : 'linux';

            var osMock = sinon.mock(os);
            osMock.expects('platform').once().returns(otherPlatform);

            ping.icmp.probe('127.0.0.1', {}, function (err, data) {

                osMock.verify();
                osMock.restore();

                expect(err).to.be.a(Error);
                expect(err.message).to.be('icmp: there was an error while executing the ping program. check the path or permissions...');

                expect(data).to.be(undefined);

                done();
            });
        });

        it('should ping google.com successfully', function (done) {

            ping.icmp.probe('google.com', {}, function (err, data) {

                expect(err).to.be(null);

                expect(data.host).to.be('google.com');
                expect(data.alive).to.be(true);
                expect(data.time).to.be.greaterThan(0);
                expect(data.time).to.be.lessThan(1000);

                done();
            });
        });

        it('should not be able to ping unknownhost.local', function (done) {

            ping.icmp.probe('unknownhost.local', {}, function (err, data) {

                expect(err).to.be(null);

                expect(data.host).to.be('unknownhost.local');
                expect(data.alive).to.be(false);
                expect(data.time).to.be.greaterThan(1000);

                done();
            });
        });
    });

    describe('promise:', function () {

        it('should ping 127.0.0.1 successfully', function (done) {

            ping.icmp.probe('127.0.0.1')
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1000);

                    done();
                })
                .done();
        });

        it('should ping google.com successfully', function (done) {

            ping.icmp.probe('google.com')
                .then(function (result) {

                    expect(result.host).to.be('google.com');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1000);

                    done();
                })
                .done();
        });

        it('should not be able to ping unknownhost.local', function (done) {

            ping.icmp.probe('unknownhost.local')
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

        it('should ping 127.0.0.1 successfully', function (done) {

            this.timeout(5000);

            ping.icmp.probe('127.0.0.1', options)
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1000);

                    done();
                })
                .done();
        });

        it('should ping google.com successfully', function (done) {

            this.timeout(5000);

            ping.icmp.probe('google.com', options)
                .then(function (result) {

                    expect(result.host).to.be('google.com');
                    expect(result.alive).to.be(true);

                    expect(result.time).to.be.greaterThan(0);
                    expect(result.time).to.be.lessThan(1000);

                    done();
                })
                .done();
        });

        it('should not be able to ping unknownhost.local', function (done) {

            this.timeout(5000);

            ping.icmp.probe('unknownhost.local', options)
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
