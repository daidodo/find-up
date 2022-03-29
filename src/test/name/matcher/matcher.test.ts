import path from 'path';

import { getCheck } from '../../utils';

describe('name:matcher', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname));
  });
  describe('not found', () => {
    const matcher = (dir: string) => path.join(dir, 'zzz');
    check([matcher, { cwd: 'aaa/bbb' }], [], 'should return empty');
  });
  describe('found in current', () => {
    const matcher = (dir: string) => path.join(dir, 'abc');
    check([matcher, { cwd: 'aaa/bbb' }], ['aaa/bbb/abc', 'abc'], 'should return matched files');
  });
  describe('found in up level', () => {
    const matcher = (dir: string) => path.join(dir, 'abc');
    check([matcher, { cwd: 'aaa' }], ['abc'], 'should return matched files');
  });
  describe('is the same', () => {
    const name = path.join(__dirname, 'aaa', 'bbb', 'abc');
    const matcher = () => name;
    check([matcher], [name], 'should return matched files');
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'bbb', 'zzz');
      const matcher = () => name;
      check([matcher], [], 'should return empty');
    });
  });
});
