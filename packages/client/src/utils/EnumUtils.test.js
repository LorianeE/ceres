const { keysOf } = require('./EnumUtils');
const { createEnum } = require('./EnumUtils');

describe('CreateEnum', () => {
  describe('createEnum()', () => {
    describe('when an object is given', () => {
      let resultEnum;
      const givenEnum = {
        KEY1: Symbol('value1'),
        KEY2: Symbol('value2'),
      };

      beforeEach(() => {
        resultEnum = createEnum(givenEnum);
      });
      it('should create an object which can be used as enum', () => {
        expect(resultEnum).toEqual({
          KEY1: givenEnum.KEY1,
          KEY2: givenEnum.KEY2,
          [givenEnum.KEY1]: 'KEY1',
          [givenEnum.KEY2]: 'KEY2',
        });
      });
    });
  });

  describe('keysOf()', () => {
    const myEnum = createEnum({
      KEY1: 'key1',
      KEY2: 'key2',
    });

    it('should return the list of keys which have a string type', () => {
      expect(keysOf(myEnum)).toEqual(['KEY1', 'KEY2']);
    });
  });
});
