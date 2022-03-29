import path from 'path';

import { getCheck } from '../../utils';

describe('options.stopAtPath', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('default', () => {
    check(['abc'], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should not stop');
  });
  describe('absolute path', () => {
    describe('current', () => {
      const stopAtPath = path.join(__dirname, 'aaa', 'bbb');
      check(['abc', { stopAtPath }], ['aaa/bbb/abc'], 'should stop as expected');
    });
    describe('up level', () => {
      const stopAtPath = path.join(__dirname, 'aaa');
      check(['abc', { stopAtPath }], ['aaa/bbb/abc', 'aaa/abc'], 'should stop as expected');
    });
    describe('not found', () => {
      check(['abc', { stopAtPath: '/zzz' }], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should not stop');
    });
  });
  describe('relative path', () => {
    describe('current', () => {
      check(['abc', { stopAtPath: '.' }], ['aaa/bbb/abc'], 'should stop as expected');
    });
    describe('up level', () => {
      check(['abc', { stopAtPath: '..' }], ['aaa/bbb/abc', 'aaa/abc'], 'should stop as expected');
    });
    describe('not found', () => {
      check(['abc', { stopAtPath: 'zzz' }], ['aaa/bbb/abc', 'aaa/abc', 'abc'], 'should not stop');
    });
  });
});
