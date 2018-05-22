/* global describe, it, expect, before */

const chai = require('chai');
const Strategy = require('../src/strategy');

const options = { freeipa: { server: 'invalid_server' } };

describe('Strategy', () => {
  describe('encountering an error during verification', () => {
    const strategy = new Strategy(options, (user, done) => {
      done(new Error('something went wrong'));
    });

    let err;
    before((done) => {
      chai.passport.use(strategy)
        .error((e) => {
          err = e;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should error', () => {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Freeipa: problem with request: getaddrinfo ENOTFOUND invalid_server invalid_server:443');
    });
  });

  describe('will fail with no password is provided', () => {
    const strategy = new Strategy(options, (user, done) => {
      done(new Error('something went horribly wrong'));
    });

    let err;

    before((done) => {
      chai.passport.use(strategy)
        .fail((e) => {
          err = e;
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'johndoe';
        })
        .authenticate();
    });

    it('should fail', () => {
      expect(err.message).to.equal('Passport-Freeipa: Missing credentials.');
    });
  });

  describe('will fail with no verify is provided', () => {
    options.passReqToCallback = true;
    try {
      const strategy = new Strategy(options);
    } catch (error) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('Passport-Freeipa: passReqToCallback is true but no verify provided.');
    }
  });

  describe('will fail with missing options', () => {
    try {
      const strategy = new Strategy({});
    } catch (error) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.message).to.equal('Passport-Freeipa: requires the node-freeipa options.');
    }
  });
});
