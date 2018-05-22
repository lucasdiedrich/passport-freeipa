# passport-freeipa

[![Build Status](https://travis-ci.org/lucasdiedrich/passport-freeipa.svg?branch=master)](https://travis-ci.org/lucasdiedrich/passport-freeipa)
[![Coverage Status](https://coveralls.io/repos/github/lucasdiedrich/passport-freeipa/badge.svg)](https://coveralls.io/github/lucasdiedrich/passport-freeipa)
[![npm](https://img.shields.io/npm/dw/localeval.svg)](https://www.npmjs.com/package/passport-freeipa)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/passport-freeipa)
![npm](https://img.shields.io/npm/l/express.svg)

[Passport](http://passportjs.org/) strategy for authenticating with a username
and password.

This module lets you authenticate using a username and password in your Node.js
applications.  By plugging into Passport, freeipa authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```bash
$ npm i --save passport-freeipa
```

## Usage

#### Configure Strategy

The freeipa authentication strategy authenticates users using a username and
password.  The strategy requires a `verify` callback, which will return
the credentials and calls `done` providing a user.

```js
passport.use(new FreeipaStrategy(
  { options,
    freeipa: { // node-freeipa options
      server: 'someservername'
    }
  },
));
```

##### Available Options

This strategy takes an optional options hash before the function, e.g. `new FreeipaStrategy({/* options */, callback})`.

The available options are:

* `usernameField` - Optional, defaults to 'username'
* `passwordField` - Optional, defaults to 'password'
* `passReqToCallback` - Optional, defaults to 'false'
* `freeipa` - Needed, same values as [node-freeipa config.](https://github.com/lucasdiedrich/node-freeipa#options)

Both fields define the name of the properties in the POST body that are sent to the server.

#### Parameters

By default, `FreeipaStrategy` expects to find credentials in parameters
named username and password. If your site prefers to name these fields
differently, options are available to change the defaults.

    passport.use(new FreeipaStrategy({
        usernameField: 'email',
        passwordField: 'passwd',
        session: false
      },
    ));

When session support is not necessary, it can be safely disabled by
setting the `session` option to false.

The verify callback can be supplied with the `request` object by setting
the `passReqToCallback` option to true, and changing callback arguments
accordingly.

    passport.use(new FreeipaStrategy({
        passReqToCallback: true,
        freeipa: {server: 'somevalidserver'}
      },
      (req, user, done) => {
        // request object is now first argument
        // ...
      }
    ));

Or just using the verifyCallback without using passReqToCallback:

    passport.use(new FreeipaStrategy({
        passReqToCallback: true,
        freeipa: {server: 'somevalidserver'}
      },
      (user, done) => {
        // user || false
      }
    ));

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'freeipa'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.post('/login',
  passport.authenticate('freeipa', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
```

## Tests

```bash
$ npm install
$ npm test
```

## Credits

- [Lucas Diedrich](http://github.com/lucasdiedrich)

This project structure is also based over:

- [Passport Local](https://github.com/jaredhanson/passport-local)
- [Passport LDAP](https://github.com/vesse/passport-ldapauth)

## License

[The MIT License](http://opensource.org/licenses/MIT)
