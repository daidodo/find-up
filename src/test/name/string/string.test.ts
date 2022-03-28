import path from 'path';

import findUp from '../../../';
import { getCheck } from '../../utils';

describe('name:string', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname));
  });
  describe('not found', () => {
    it('should return empty', () => {
      check(findUp.sync('zzz', { cwd: 'aaa/bbb' }), []);
    });
  });
  describe('found in current', () => {
    it('should return matched files', () => {
      check(findUp.sync('abc', { cwd: 'aaa/bbb' }), ['aaa/bbb/abc', 'abc']);
    });
  });
  describe('found in up level', () => {
    it('should return matched files', () => {
      check(findUp.sync('abc', { cwd: 'aaa' }), ['abc']);
    });
  });
  describe('is absolute', () => {
    const name = path.join(__dirname, 'aaa', 'bbb', 'abc');
    it('should return matched files', () => {
      check(findUp.sync(name), [name]);
    });
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'bbb', 'zzz');
      it('should return empty', () => {
        check(findUp.sync(name), []);
      });
    });
  });
});
