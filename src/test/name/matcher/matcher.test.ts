import path from 'path';

import findUp from '../../../';
import { getCheck } from '../../utils';

describe('name:matcher', () => {
  const check = getCheck(__dirname);
  beforeAll(() => {
    process.chdir(path.join(__dirname));
  });
  describe('not found', () => {
    const matcher = (dir: string) => path.join(dir, 'zzz');
    it('should return empty', () => {
      check(findUp.sync(matcher, { cwd: 'aaa/bbb' }), []);
    });
  });
  describe('found in current', () => {
    const matcher = (dir: string) => path.join(dir, 'abc');
    it('should return matched files', () => {
      check(findUp.sync(matcher, { cwd: 'aaa/bbb' }), ['aaa/bbb/abc', 'abc']);
    });
  });
  describe('found in up level', () => {
    const matcher = (dir: string) => path.join(dir, 'abc');
    it('should return matched files', () => {
      check(findUp.sync(matcher, { cwd: 'aaa' }), ['abc']);
    });
  });
  describe('is the same', () => {
    const name = path.join(__dirname, 'aaa', 'bbb', 'abc');
    const matcher = () => name;
    it('should return matched files', () => {
      check(findUp.sync(matcher), [name]);
    });
    describe('not found', () => {
      const name = path.join(__dirname, 'aaa', 'bbb', 'zzz');
      const matcher = () => name;
      it('should return empty', () => {
        check(findUp.sync(matcher), []);
      });
    });
  });
});
