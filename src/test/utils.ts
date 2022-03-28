import path from 'path';

export function getCheck(dir: string) {
  return (actual: string[], expected: string[]) => {
    expect(actual).toHaveLength(expected.length);
    actual.forEach((a, i) => {
      const e = expected[i];
      expect(a).toMatch(
        new RegExp(`${path.join('src', 'test', ...dir.split('/'), ...e.split('/'))}$`),
      );
    });
  };
}
