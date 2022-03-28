import path from 'path';

export function getCheck(dir: string) {
  return (actual: string[], expected: string[]) => {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
      const e = expected[i];
      const p = path.join('src', 'test', ...dir.split('/'), ...e.split('/'));
      expect(a).toMatch(new RegExp(`${p.replace('\\', '\\\\')}$`));
    });
  };
}
