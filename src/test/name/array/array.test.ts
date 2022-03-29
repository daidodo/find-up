import path from 'path';

import { getCheck } from '../../utils';

describe('name:array', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('not found', () => {
    check([['zzz']], [], 'should return empty');
  });
  describe('found', () => {
    check([['abc', 'def']], ['aaa/bbb/abc', 'aaa/def', 'abc'], 'should return matched files');
    describe('reverse', () => {
      check([['def', 'abc']], ['aaa/bbb/abc', 'aaa/def', 'def'], 'should return matched files');
    });
    describe('with duplicates', () => {
      check(
        [['abc', 'def', 'def']],
        ['aaa/bbb/abc', 'aaa/def', 'abc'],
        'should return matched files',
      );
    });
  });
  describe('some are absolute', () => {
    const name = path.join(__dirname, 'aaa', 'def');
    check([['abc', name]], [name, 'aaa/bbb/abc', 'abc'], 'should return matched files');
    describe('reverse', () => {
      check([[name, 'abc']], [name, 'aaa/bbb/abc', 'abc'], 'should return matched files');
    });
    describe('another', () => {
      check([[name, 'def']], [name, 'def'], 'should return matched files');
    });
    describe('with duplicates', () => {
      check([['abc', name, name]], [name, 'aaa/bbb/abc', 'abc'], 'should return matched files');
    });
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'zzz');
      check([['abc', name]], ['aaa/bbb/abc', 'abc'], 'should return matched files');
    });
  });
  describe('all are absolute', () => {
    const name1 = path.join(__dirname, 'aaa', 'def');
    const name2 = path.join(__dirname, 'aaa', 'bbb', 'abc');
    describe('one name', () => {
      check([[name1]], [name1], 'should return matched files');
      describe('with duplicates', () => {
        check([[name1, name1]], [name1], 'should return matched files');
      });
    });
    check([[name1, name2]], [name1, name2], 'should return matched files');
    describe('with duplicates', () => {
      check([[name1, name2, name1]], [name1, name2], 'should return matched files');
      describe('more', () => {
        check([[name1, name2, name1, name2]], [name1, name2], 'should return matched files');
      });
    });
    describe('limit', () => {
      check([[name1, name2], { stopAtLimit: 1 }], [name1], 'should return matched files');
      describe('reverse', () => {
        check([[name2, name1], { stopAtLimit: 1 }], [name2], 'should return matched files');
      });
    });
    describe('some not found', () => {
      const name1 = path.join(__dirname, 'aaa', 'zzz');
      check([[name1, name2]], [name2], 'should return matched files');
      describe('reverse', () => {
        check([[name2, name1]], [name2], 'should return matched files');
      });
      describe('all not found', () => {
        const name2 = path.join(__dirname, 'aaa', 'bbb', 'zzz');
        check([[name1, name2]], [], 'should return matched files');
      });
    });
  });
});
