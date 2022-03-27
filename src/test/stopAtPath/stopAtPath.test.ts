import path from 'node:path';

import findUp from '../../';
import { getCheck } from '../utils';

describe('stopAtPath', () => {
  const check = getCheck('stopAtPath');
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('default', () => {
    it('should not stop', () => {
      check(findUp.sync('abc'), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
    });
  });
  describe('absolute path', () => {
    describe('current', () => {
      const stopAtPath = path.join(__dirname, 'aaa', 'bbb');
      it('should stop as expected', () => {
        check(findUp.sync('abc', { stopAtPath }), ['aaa/bbb/abc']);
      });
    });
    describe('up level', () => {
      const stopAtPath = path.join(__dirname, 'aaa');
      it('should stop as expected', () => {
        check(findUp.sync('abc', { stopAtPath }), ['aaa/bbb/abc', 'aaa/abc']);
      });
    });
    describe('not found', () => {
      it('should not stop', () => {
        check(findUp.sync('abc', { stopAtPath: '/zzz' }), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
      });
    });
  });
  describe('relative path', () => {
    describe('current', () => {
      it('should stop as expected', () => {
        check(findUp.sync('abc', { stopAtPath: '.' }), ['aaa/bbb/abc']);
      });
    });
    describe('up level', () => {
      it('should stop as expected', () => {
        check(findUp.sync('abc', { stopAtPath: '..' }), ['aaa/bbb/abc', 'aaa/abc']);
      });
    });
    describe('not found', () => {
      it('should not stop', () => {
        check(findUp.sync('abc', { stopAtPath: 'zzz' }), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
      });
    });
  });
});
