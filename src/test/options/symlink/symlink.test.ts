import path from 'path';

import findUp from '../../..';
import { getCheck } from '../../utils';

describe('allowSymlinks', () => {
  const check = getCheck('options/symlink');
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa'));
  });
  describe('default', () => {
    it('should allow symlink', () => {
      check(findUp.sync('abc'), ['aaa/abc', 'abc']);
    });
  });
  describe('true', () => {
    it('should allow symlink', () => {
      check(findUp.sync('abc', { allowSymlinks: true }), ['aaa/abc', 'abc']);
    });
  });
  describe('false', () => {
    it('should disallow symlink', () => {
      check(findUp.sync('abc', { allowSymlinks: false }), ['aaa/abc']);
    });
  });
});
