import path, { sep } from 'path';

import findUp from '../';

type Params = Parameters<typeof findUp>;

export function getCheck(dir: string) {
  const r = path.relative(__dirname, dir);
  const checkString = (actual: string[], expected: string[]) => {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
      const e = expected[i];
      if (path.isAbsolute(e)) expect(a).toBe(e);
      else {
        const p = path.join('src', 'test', ...r.split(sep), ...e.split('/'));
        expect(a).toMatch(new RegExp(`${p.replace(/\\/g, '\\\\')}$`));
      }
    });
  };
  const check = async (actual: string[] | AsyncGenerator<string, void>, expected: string[]) => {
    if (Array.isArray(actual)) checkString(actual, expected);
    else {
      const results: string[] = [];
      for await (const n of actual) results.push(n);
      checkString(results, expected);
    }
  };
  return (params: Params, expected: string[], msg: string) => {
    describe('findUp', () => {
      it(msg, async () => {
        await check(await findUp(...params), expected);
      });
    });
    describe('findUp.sync', () => {
      it(msg, async () => {
        await check(findUp.sync(...params), expected);
      });
    });
    describe('findUp.gen', () => {
      it(msg, async () => {
        await check(findUp.gen(...params), expected);
      });
    });
  };
}
