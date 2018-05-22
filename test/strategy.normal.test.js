/* global describe, it, expect, before */
/* jshint expr: true */

const chai = require('chai');
const Strategy = require('../src/strategy');
const options = { server: 'ipa.demo1.freeipa.org' };

describe('Strategy', () =>  {

  describe('handling a request with valid credentials in body', () =>  {
    var strategy = new Strategy(options, (user, done) =>  {
      return done(null, user);
    });

    it('should supply user', (done) =>  {
      chai.passport.use(strategy)
        .success((result) => {
          var user = result;
          expect(user).to.not.be.null;
          expect(user.uid).to.have.length(1);
          done();
        })
        .req((req) => {
          req.body = {};
          req.body.username = 'helpdesk';
          req.body.password = 'Secret123';
        })
        .authenticate();
    }).timeout(6000);
  });
});
