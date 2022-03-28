import path from 'path';

import findUp from '../../../';
import { getCheck } from '../../utils';

describe('options.cwd', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(__dirname);
  });
  describe('default', () => {
    it('should start from CWD', () => {
      check(findUp.sync('abc'), ['abc']);
    });
  });
  describe('absolute path', () => {
    const cwd = path.join(__dirname, 'aaa');
    it('should start from expected', () => {
      check(findUp.sync('abc', { cwd }), ['aaa/abc', 'abc']);
    });
  });
  describe('relative path', () => {
    const cwd = 'aaa';
    it('should start from expected', () => {
      check(findUp.sync('abc', { cwd }), ['aaa/abc', 'abc']);
    });
  });
});
