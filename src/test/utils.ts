import path, { sep } from 'path';

export function getCheck(dir: string) {
  const r = path.relative(__dirname, dir);
  const check = (actual: string[], expected: string[]) => {
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
  return (actual: string[] | Promise<string[]>, expected: string[]) => {
    if (Array.isArray(actual)) return check(actual, expected);
    actual.then(results => check(results, expected));
  };
}
