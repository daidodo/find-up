import path from 'path';

import findUp from '../../';
import { getCheck } from '../utils';

describe('type', () => {
  const check = getCheck('type');
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'abc'));
  });
  describe('default', () => {
    it('should match file', () => {
      check(findUp.sync('abc'), ['abc/abc']);
    });
  });
  describe('file', () => {
    it('should match file', () => {
      check(findUp.sync('abc', { type: 'file' }), ['abc/abc']);
    });
  });
  describe('directory', () => {
    it('should start from expected', () => {
      check(findUp.sync('abc', { type: 'directory' }), ['abc']);
    });
  });
});
