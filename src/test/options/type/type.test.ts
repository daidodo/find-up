import path from 'path';

import { getCheck } from '../../utils';

describe('options.type', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname, 'abc'));
  });
  describe('default', () => {
    check(['abc'], ['abc/abc'], 'should match file');
  });
  describe('file', () => {
    check(['abc', { type: 'file' }], ['abc/abc'], 'should match file');
  });
  describe('directory', () => {
    check(['abc', { type: 'directory' }], ['abc'], 'should match file');
  });
});
