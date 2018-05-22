/**
 * Module dependencies.
 */
const passport = require('passport-strategy');
const util = require('util');
const ipa = require('node-freeipa');
const lookup = require('./lookup');
const { _extend } = require('util');

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
 *   - `passReqToCallback`        Freeipa Server FQDN : Required : Optional
 *   - `server`        Freeipa Server FQDN : Required
 *   - `ca`            Path to the CA File : Optional
 *   - `expires`       Time in minutes to expiration of cookie/auth : Optional
 *
 * Examples:
 *
 *     passport.use(new FreeipaStrategy(
 *       { server: 'freeipa.server.domain' },
 *       function(user, done) {
 *         User.findOne({ username: username, password: password }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
  if (!options || !options.server) { throw new TypeError('FreeipaStrategy requires the server options.'); }
  if (!verify) { throw new TypeError('FreeipaStrategy requires a verify callback.'); }

  this._passReqToCallback = options.passReqToCallback || false;
  this._freeipaOptions = options;

  passport.Strategy.call(this);

  this.name = 'freeipa';
  this._verify = verify;
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy);

/**
 * Authenticate request based on the user and password.
 *
 * @param {Object} req
 * @api protected
 */
Strategy.prototype.authenticate = function(req, options) {
  var self = this;

  options = options || {};

  var username = lookup(req.body, 'username') || lookup(req.query, 'username');
  var password = lookup(req.body, 'password') || lookup(req.query, 'password');

  if (!username || !password) {
    return this.fail({ message: options.badRequestMessage || 'Freeipa: Missing credentials' }, 400);
  }

  function verified(err, user, info) {
    if (err || user.error) { return self.error(err); }
    if (!user) { return self.fail(info); }
    self.success(user, info);
  }

  ipa.configure(_extend(this._freeipaOptions, {auth: { user: username, pass: password }}));

  ipa.user_show([username]).then((user) => {

    if (self._passReqToCallback) {
      this._verify(req, user, verified);
    } else {
      this._verify(user, verified);
    }

  }).catch((error) => {
    return self.error(error);
  });
};

module.exports = Strategy;
