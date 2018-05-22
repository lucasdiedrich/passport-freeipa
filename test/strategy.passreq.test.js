/* global describe, it, expect, before */
/* jshint expr: true */

const chai = require('chai');
const Strategy = require('../src/strategy');

const options = { freeipa: { server: 'ipa.demo1.freeipa.org' } };

describe('Strategy', () => {
  describe('passing request to verify with passReqToCallback', () => {
    options.passReqToCallback = true;
    const strategy = new Strategy(options, (req, user, done) => {
      if (user && user.error === undefined) {
        return done(null, user, { scope: 'read', foo: req.headers['x-foo'] });
      }
      return done(null, user);
    });

    it('should supply user with callback', (done) => {
      chai.passport.use(strategy)
        .success((user, reqHeaders) => {
          expect(user.uid.length).to.equal(1);
          expect(reqHeaders.foo).to.equal('hello');
          done();
        })
        .req((req) => {
          req.headers['x-foo'] = 'hello';

          req.body = {};
          req.body.username = 'helpdesk';
          req.body.password = 'Secret123';
        })
        .authenticate();
    }).timeout(3000);
  });

  describe('passing request to verify without passReqToCallback', () => {
    options.passReqToCallback = false;
    const strategy = new Strategy(options, (user, done) => done(null, user));

    it('should supply user without callback', (done) => {
      chai.passport.use(strategy)
        .success((user) => {
          expect(user.uid.length).to.equal(1);
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'helpdesk';
          req.body.password = 'Secret123';
        })
        .authenticate();
    }).timeout(3000);
  });
});
