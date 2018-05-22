/* global describe, it, expect */

var Strategy = require('../src/strategy');

const options = { server: 'nonexistserver' }

describe('Strategy', () => {

  var strategy = new Strategy(options,() => { });

  it('should be named local', () => {
    expect(strategy.name).to.equal('freeipa');
  });

  it('should throw if constructed without a verify callback', () => {
    expect(() => {
      var s = new Strategy(options);
    }).to.throw(TypeError, 'FreeipaStrategy requires a verify callback');
  });

  it('should throw if constructed without server options', () => {
    expect(() => {
      var s = new Strategy(null, () => {});
    }).to.throw(TypeError, 'FreeipaStrategy requires the server options');
  });

});
