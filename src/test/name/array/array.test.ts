import path from 'path';

import findUp from '../../../';
import { getCheck } from '../../utils';

describe('name:array', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa', 'bbb'));
  });
  describe('not found', () => {
    it('should return empty', () => {
      check(findUp.sync(['zzz']), []);
    });
  });
  describe('found', () => {
    it('should return matched files', () => {
      check(findUp.sync(['abc', 'def']), ['aaa/bbb/abc', 'aaa/def', 'abc']);
      check(findUp.sync(['abc', 'def', 'def']), ['aaa/bbb/abc', 'aaa/def', 'abc']);
      check(findUp.sync(['def', 'abc']), ['aaa/bbb/abc', 'aaa/def', 'def']);
    });
  });
  describe('some are absolute', () => {
    const name = path.join(__dirname, 'aaa', 'def');
    it('should return matched files', () => {
      check(findUp.sync(['abc', name]), [name, 'aaa/bbb/abc', 'abc']);
      check(findUp.sync(['abc', name, name]), [name, 'aaa/bbb/abc', 'abc']);
      check(findUp.sync([name, 'abc']), [name, 'aaa/bbb/abc', 'abc']);
      check(findUp.sync([name, 'def']), [name, 'def']);
    });
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'zzz');
      it('should return matched files', () => {
        check(findUp.sync(['abc', name]), ['aaa/bbb/abc', 'abc']);
      });
    });
  });
  describe('all are absolute', () => {
    const name1 = path.join(__dirname, 'aaa', 'def');
    const name2 = path.join(__dirname, 'aaa', 'bbb', 'abc');
    it('should return matched files', () => {
      check(findUp.sync([name1]), [name1]);
      check(findUp.sync([name1, name1]), [name1]);
      check(findUp.sync([name1, name2]), [name1, name2]);
      check(findUp.sync([name1, name2, name1]), [name1, name2]);
      check(findUp.sync([name1, name2, name1, name2]), [name1, name2]);
    });
    describe('limit', () => {
      it('should return matched files', () => {
        check(findUp.sync([name1, name2], { stopAtLimit: 1 }), [name1]);
        check(findUp.sync([name2, name1], { stopAtLimit: 1 }), [name2]);
      });
    });
    describe('some not found', () => {
      const name1 = path.join(__dirname, 'aaa', 'zzz');
      it('should return matched files', () => {
        check(findUp.sync([name1, name2]), [name2]);
        check(findUp.sync([name2, name1]), [name2]);
      });
      describe('all not found', () => {
        const name2 = path.join(__dirname, 'aaa', 'bbb', 'zzz');
        it('should return matched files', () => {
          check(findUp.sync([name1, name2]), []);
        });
      });
    });
  });
});
