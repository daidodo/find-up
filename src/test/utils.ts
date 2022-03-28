import path, { sep } from 'path';

export function getCheck(dir: string) {
  const r = path.relative(__dirname, dir);
  return (actual: string[], expected: string[]) => {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
      const e = expected[i];
      const p = path.join('src', 'test', ...r.split(sep), ...e.split('/'));
      expect(a).toMatch(new RegExp(`${p.replace(/\\/g, '\\\\')}$`));
    });
  };
}
