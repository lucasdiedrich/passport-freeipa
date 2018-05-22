/**
 * Module dependencies.
 */
const passport = require('passport-strategy');
const ipa = require('node-freeipa');
const lookup = require('./lookup');
const { _extend, inherits } = require('util');

/**
 * `Strategy` constructor.
 *
 * The freeipa authentication strategy authenticates requests based on the
 * credentials submitted through an HTML-based login form.
 *
 * Applications must supply a `verify` callback which accepts `username` and
 * `password` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occurred, `err` should be set.
 *
 * `options` can be used to change the fields in which the credentials are found.
 *
 * Options:
 *   - `freeipa` - All node-freeipa options: https://github.com/lucasdiedrich/node-freeipa#options
 *   - `usernameField` - Optional
 *   - `passwordField` - Optional
 *   - `passReqToCallback` - Optional
 *
 * Examples:
 *
 *     passport.use(new FreeipaStrategy({
 *       usernameField: '',
 *       passwordField: '',
 *       passReqToCallback: '',
 *       freeipa: {
 *          server: 'freeipa.server.domain'
 *       },
 *     }, function(user, done) {
 *        return cb(null, user);
 *     }));
 *
 * @param {Object} options
 * @param {Function} verify - optional
 * @api public
 */
function Strategy(options, verify) {
  if (!options || !options.freeipa || !options.freeipa.server) { throw new TypeError('Passport-Freeipa: requires the node-freeipa options.'); }
  if (!verify && options.passReqToCallback) { throw new TypeError('Passport-Freeipa: passReqToCallback is true but no verify provided.'); }

  this.freeipaConfig = options.freeipa;
  this.usernameField = options.usernameField || 'username';
  this.passwordField = options.passwordField || 'password';
  this.passReqToCallback = options.passReqToCallback || false;

  passport.Strategy.call(this);

  this.name = 'freeipa';
  this.verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the user and password.
 *
 * @param {Object} req
 * @api protected
 */
/* eslint consistent-return: [0], func-names: [0]  */
Strategy.prototype.authenticate = function (req, options = {}) {
  const self = this;

  const username = lookup(req.body, this.usernameField) || lookup(req.query, this.usernameField);
  const password = lookup(req.body, this.passwordField) || lookup(req.query, this.passwordField);

  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Passport-Freeipa: Missing credentials.' }, 400);
  }

  function verified(err, user, info) {
    if (err || user.error) { return self.error(err || user.error); }
    if (!user) { return self.fail(info); }
    return self.success(user, info);
  }

  ipa.configure(_extend(this.freeipaConfig, { auth: { user: username, pass: password } }));

  ipa.user_show([username]).then((user) => {
    if (this.verify) {
      if (self.passReqToCallback) {
        this.verify(req, user, verified);
      } else {
        this.verify(user, verified);
      }
    } else {
      self.success(user);
    }
  }).catch((error) => {
    self.error(error);
  });
};

module.exports = Strategy;
