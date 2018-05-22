/* global describe, it, expect, before */
/* jshint expr: true */

var chai = require('chai')
  , Strategy = require('../src/strategy');

const options = { server: 'ipa.demo1.freeipa.org', passReqToCallback: true };

describe('Strategy', () => {

  describe('passing request to verify callback', () => {
    var strategy = new Strategy(options, (req, user, done) => {
      if (user) {
        return done(null, user, { scope: 'read', foo: req.headers['x-foo'] });
      }
      return done(null, false);
    });

    it('should supply user and work', (done) => {
      chai.passport.use(strategy)
        .success((user, req_headers) => {
          expect(user.uid.length).to.equal(1);
          expect(req_headers.foo).to.equal('hello');
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
});
