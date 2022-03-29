import path from 'path';

import { getCheck } from '../../utils';

describe('options.stopAtLimit', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('default', () => {
    check(['abc'], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should not stop');
  });
  describe('negative', () => {
    check(['abc', { stopAtLimit: -1 }], [], 'should return 0 results');
  });
  describe('0', () => {
    check(['abc', { stopAtLimit: 0 }], [], 'should return 0 results');
  });
  describe('1', () => {
    check(['abc', { stopAtLimit: 1 }], ['aaa/bbb/abc'], 'should 1 result');
    describe('with hole', () => {
      check(['abc', { cwd: 'ccc', stopAtLimit: 1 }], ['aaa/bbb/abc'], 'should 1 result');
    });
  });
  describe('2', () => {
    check(['abc', { stopAtLimit: 2 }], ['aaa/bbb/abc', 'aaa/abc'], 'should 2 results');
    describe('with hole', () => {
      check(
        ['abc', { cwd: 'ccc', stopAtLimit: 2 }],
        ['aaa/bbb/abc', 'aaa/abc'],
        'should 2 results',
      );
    });
  });
  describe('3', () => {
    check(['abc', { stopAtLimit: 3 }], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should 3 results');
    describe('with hole', () => {
      check(
        ['abc', { cwd: 'ccc', stopAtLimit: 3 }],
        ['aaa/bbb/abc', 'aaa/abc', 'abc'],
        'should 3 results',
      );
    });
  });
  describe('4', () => {
    check(['abc', { stopAtLimit: 4 }], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should 3 results');
    describe('with hole', () => {
      check(
        ['abc', { cwd: 'ccc', stopAtLimit: 4 }],
        ['aaa/bbb/abc', 'aaa/abc', 'abc'],
        'should 3 results',
      );
    });
  });
});
