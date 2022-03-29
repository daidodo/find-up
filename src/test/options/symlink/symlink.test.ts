import path from 'path';

import { getCheck } from '../../utils';

describe('options.allowSymlinks', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'aaa'));
  });
  describe('default', () => {
    check(['abc'], ['aaa/abc', 'abc'], 'should allow symlink');
  });
  describe('true', () => {
    check(['abc', { allowSymlinks: true }], ['aaa/abc', 'abc'], 'should allow symlink');
  });
  describe('false', () => {
    check(['abc', { allowSymlinks: false }], ['aaa/abc'], 'should disallow symlink');
  });
});
