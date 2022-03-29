import path from 'path';

import { getCheck } from '../../utils';

describe('options.cwd', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(__dirname);
  });
  describe('default', () => {
    check(['abc'], ['abc'], 'should start from CWD');
  });
  describe('absolute path', () => {
    const cwd = path.join(__dirname, 'aaa');
    check(['abc', { cwd }], ['aaa/abc', 'abc'], 'should start from expected');
  });
  describe('relative path', () => {
    const cwd = 'aaa';
    check(['abc', { cwd }], ['aaa/abc', 'abc'], 'should start from expected');
  });
});
