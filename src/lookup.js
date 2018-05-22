module.exports = (obj, field) => {
  if (!obj) { return null; }

  const chain = field.split(']').join('').split('[');

  for (let i = 0, len = chain.length; i < len; i += 1) {
    const prop = obj[chain[i]];
    if (typeof (prop) === 'undefined') { return null; }
    if (typeof (prop) !== 'object') { return prop; }
    /* eslint no-param-reassign: [0] */
    obj = prop;
  }

  return null;
};
