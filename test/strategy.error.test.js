/* global describe, it, expect, before */

const chai = require('chai');
const Strategy = require('../src/strategy');
const options = { server: 'invalid_server' }

describe('Strategy', () =>  {

  describe('encountering an error during verification', () =>  {
    var strategy = new Strategy(options, (user, done) => {
      done(new Error('something went wrong'));
    });

    var err;
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

    it('should error', () =>  {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Freeipa: problem with request: getaddrinfo ENOTFOUND invalid_server invalid_server:443');
    });
  });

  describe('encountering an exception during verification', () =>  {
    var strategy = new Strategy(options, (user, done) => {
      throw new Error('something went horribly wrong');
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .error(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'johndoe';
          req.body.password = 'secret';
        })
        .authenticate();
    });

    it('should error', () =>  {
      expect(err).to.be.an.instanceof(Error);
      expect(err.message).to.equal('Freeipa: problem with request: getaddrinfo ENOTFOUND invalid_server invalid_server:443');
    });
  });

  describe('will fail with no password is provided', () =>  {
    var strategy = new Strategy(options, (user, done) => {
      throw new Error('something went horribly wrong');
    });

    var err;

    before(function(done) {
      chai.passport.use(strategy)
        .fail(function(e) {
          err = e;
          done();
        })
        .req(function(req) {
          req.body = {};
          req.body.username = 'johndoe';
        })
        .authenticate();
    });

    it('should fail', () =>  {
      expect(err.message).to.equal('Freeipa: Missing credentials');
    });
  });
});
