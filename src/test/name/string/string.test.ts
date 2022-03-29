import path from 'path';

import { getCheck } from '../../utils';

describe('name:string', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname));
  });
  describe('not found', () => {
    check(['zzz', { cwd: 'aaa/bbb' }], [], 'should return empty');
  });
  describe('found in current', () => {
    check(['abc', { cwd: 'aaa/bbb' }], ['aaa/bbb/abc', 'abc'], 'should return matched files');
  });
  describe('found in up level', () => {
    check(['abc', { cwd: 'aaa' }], ['abc'], 'should return matched files');
  });
  describe('is absolute', () => {
    const name = path.join(__dirname, 'aaa', 'bbb', 'abc');
    check([name], [name], 'should return matched files');
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'bbb', 'zzz');
      check([name], [], 'should return empty');
    });
  });
});
