/* global describe, it, expect */

var strategy = require('..');

describe('passport-freeipa', () =>  {

  it('should export Strategy constructor directly from package', () =>  {
    expect(strategy).to.be.a('function');
    expect(strategy).to.equal(strategy.Strategy);
  });

});
