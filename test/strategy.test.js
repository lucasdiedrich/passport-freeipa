/* global describe, it, expect */

const Strategy = require('../src/strategy');

const options = { freeipa: { server: 'nonexistserver' } };

describe('Strategy', () => {
  const strategy = new Strategy(options, () => { });

  it('should be named freeipa', () => {
    expect(strategy.name).to.equal('freeipa');
  });

  it('should throw if constructed without server options', () => {
    expect(() => {
      const s = new Strategy(null, () => {});
    }).to.throw(TypeError, 'Passport-Freeipa: requires the node-freeipa options');
  });
});
