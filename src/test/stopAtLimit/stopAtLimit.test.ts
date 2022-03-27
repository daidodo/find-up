import path from 'node:path';

import findUp from '../../';
import { getCheck } from '../utils';

describe('stopAtLimit', () => {
  const check = getCheck('stopAtLimit');
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('default', () => {
    it('should not stop', () => {
      check(findUp.sync('abc'), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
    });
  });
  describe('negative', () => {
    it('should return 0 results', () => {
      check(findUp.sync('abc', { stopAtLimit: -1 }), []);
    });
  });
  describe('0', () => {
    it('should return 0 results', () => {
      check(findUp.sync('abc', { stopAtLimit: 0 }), []);
    });
  });
  describe('1', () => {
    it('should 1 result', () => {
      check(findUp.sync('abc', { stopAtLimit: 1 }), ['aaa/bbb/abc']);
    });
    describe('with hole', () => {
      it('should 1 result', () => {
        check(findUp.sync('abc', { cwd: 'ccc', stopAtLimit: 1 }), ['aaa/bbb/abc']);
      });
    });
  });
  describe('2', () => {
    it('should 2 results', () => {
      check(findUp.sync('abc', { stopAtLimit: 2 }), ['aaa/bbb/abc', 'aaa/abc']);
    });
    describe('with hole', () => {
      it('should 2 results', () => {
        check(findUp.sync('abc', { cwd: 'ccc', stopAtLimit: 2 }), ['aaa/bbb/abc', 'aaa/abc']);
      });
    });
  });
  describe('3', () => {
    it('should 3 results', () => {
      check(findUp.sync('abc', { stopAtLimit: 3 }), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
    });
    describe('with hole', () => {
      it('should 3 results', () => {
        check(findUp.sync('abc', { cwd: 'ccc', stopAtLimit: 3 }), [
          'aaa/bbb/abc',
          'aaa/abc',
          'abc',
        ]);
      });
    });
  });
  describe('4', () => {
    it('should 3 results', () => {
      check(findUp.sync('abc', { stopAtLimit: 4 }), ['aaa/bbb/abc', 'aaa/abc', 'abc']);
    });
    describe('with hole', () => {
      it('should 3 results', () => {
        check(findUp.sync('abc', { cwd: 'ccc', stopAtLimit: 4 }), [
          'aaa/bbb/abc',
          'aaa/abc',
          'abc',
        ]);
      });
    });
  });
});
