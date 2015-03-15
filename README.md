# node-ping

A simple wrapper for performing system ICMP ping in node.js

## Installation

```
npm install alexgervais/node-ping
```

## Support

Supported platforms are `linux` and `darwin` (Mac OSX)

## Usage

### Tradition calls

```node
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
hosts.forEach(function(host){
    ping.sys.probe(host, function(err, isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});
```

### Promise wrapper

```node
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (res) {
            console.log(res);
        });
});
```

### Promise Wrapper with configable ping options

**The configurable options are only supported by the promise wrapper**

```node
hosts.forEach(function (host) {
    ping.promise.probe(host, {
        timeout: 10,
        extra: ["-i 2"]
    }).then(function (res) {
            console.log(res);
        });
});
```

## License

MIT

## Credits

Forked from Daniel Zelisko http://github.com/danielzzz/node-ping
