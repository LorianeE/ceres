const enums = new Map();

exports.createEnum = (...args) => {
  const objAsEnum = {};
  const keys = Object.keys(args[0]);

  keys.forEach((key) => {
    objAsEnum[key] = args[0][key];
    // reverse key/value for converting purpose
    objAsEnum[objAsEnum[key]] = key;
  });

  const obj = Object.freeze(objAsEnum);

  enums.set(obj, keys);

  return obj;
};

exports.keysOf = (objEnum) => enums.get(objEnum);
