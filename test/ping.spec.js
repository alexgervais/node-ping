'use strict';

var expect = require('expect.js');

describe('ping:', function () {

    var ping;
    var pingOptions;

    before(function (done) {

        process.env.NODE_ENV = 'test';

        done();
    });

    after(function (done) {

        done();
    });

    beforeEach(function (done) {

        ping = require('../index');
        pingOptions = {
            timeout: 4,
            extra: ['-i', '2']
        };

        done();
    });

    afterEach(function (done) {

        done();
    });

    describe('ping-sys:', function () {

        it('should ping 127.0.0.1 successfully', function (done) {

            ping.sys.probe('127.0.0.1', function (err, data) {

                expect(err).to.be(null);
                expect(data).to.be(true);

                done();
            });
        });

        it('should ping google.com successfully', function (done) {

            ping.sys.probe('google.com', function (err, data) {

                expect(err).to.be(null);
                expect(data).to.be(true);

                done();
            });
        });

        it('should not be able to ping yahoo.com', function (done) {

            ping.sys.probe('yahoo.com', function (err, data) {

                expect(err).to.be(null);
                expect(data).to.be(false);

                done();
            });
        });
    });

    describe('ping-promise:', function () {

        it('should ping 127.0.0.1 successfully', function (done) {

            ping.promise.probe('127.0.0.1')
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1');
                    expect(result.alive).to.be(true);

                    done();
                })
                .done();
        });

        it('should ping google.com successfully', function (done) {

            ping.promise.probe('google.com')
                .then(function (result) {

                    expect(result.host).to.be('google.com');
                    expect(result.alive).to.be(true);

                    done();
                })
                .done();
        });

        it('should not be able to ping yahoo.com', function (done) {

            ping.promise.probe('yahoo.com')
                .then(function (result) {

                    expect(result.host).to.be('yahoo.com');
                    expect(result.alive).to.be(false);

                    done();
                })
                .done();
        });
    });

    describe('ping-promise, with options:', function () {

        it('should ping 127.0.0.1 successfully', function (done) {

            this.timeout(5000);

            ping.promise.probe('127.0.0.1', pingOptions)
                .then(function (result) {

                    expect(result.host).to.be('127.0.0.1');
                    expect(result.alive).to.be(true);

                    done();
                })
                .done();
        });

        it('should ping google.com successfully', function (done) {

            this.timeout(5000);

            ping.promise.probe('google.com', pingOptions)
                .then(function (result) {

                    expect(result.host).to.be('google.com');
                    expect(result.alive).to.be(true);

                    done();
                })
                .done();
        });

        it('should not be able to ping yahoo.com', function (done) {

            this.timeout(5000);

            ping.promise.probe('yahoo.com', pingOptions)
                .then(function (result) {

                    expect(result.host).to.be('yahoo.com');
                    expect(result.alive).to.be(false);

                    done();
                })
                .done();
        });
    });
});
