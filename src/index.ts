import fs, {
  promises,
  Stats,
} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  assertIsString,
  isNonNull,
} from '@dozerg/condition';

export interface Options {
  /**
   * The directory to start from. Default to `process.cwd()`;
   */
  cwd?: URL | string;
  /**
   * The type of paths that can match. Default to _"file"_;
   */
  type?: 'file' | 'directory';
  /**
   * Allow symlinks to match if they point to the chosen path type. Default to _true_.
   */
  allowSymlinks?: boolean;
  /**
   * The path to the directory to stop the search before reaching root if there were no matches.
   * Default to `path.parse(cwd).root`.
   */
  stopAtPath?: URL | string;
  /**
   * Stop the search once a number of results have been found. Default to `Number.POSITIVE_INFINITY`.
   */
  stopAtLimit?: number;
}

type Matcher = (directory: string) => string | Promise<string> | undefined;

export default async function findUp(
  name: string | readonly string[] | Matcher,
  options: Options = {},
) {
  const { directory, stopAt, root, limit } = normalise(options);
  const { found, runMatcher } = await getRunMatcher(name, { ...options, cwd: directory });
  const unique = new Set<string>(found);
  for (let cwd = directory; found.length < limit; cwd = path.dirname(cwd)) {
    const { result, stop } = await runMatcher({ ...options, cwd });
    if (result && !unique.has(result)) {
      found.push(result);
      unique.add(result);
    }
    if (stop || cwd === stopAt || cwd === root) break;
  }
  return found.slice(0, limit);
}

findUp.sync = (name: string | readonly string[] | Matcher, options: Options = {}) => {
  const { directory, stopAt, root, limit } = normalise(options);
  const { found, runMatcher } = getRunMatcher.sync(name, { ...options, cwd: directory });
  const unique = new Set<string>(found);
  for (let cwd = directory; found.length < limit; cwd = path.dirname(cwd)) {
    const { result, stop } = runMatcher({ ...options, cwd });
    if (result && !unique.has(result)) {
      found.push(result);
      unique.add(result);
    }
    if (stop || cwd === stopAt || cwd === root) break;
  }
  return found.slice(0, limit);
};

findUp.gen = async function* (name: string | readonly string[] | Matcher, options: Options = {}) {
  const { directory, stopAt, root, limit } = normalise(options);
  const { found, runMatcher } = await getRunMatcher(name, { ...options, cwd: directory });
  yield* found.slice(0, limit);
  const unique = new Set<string>(found);
  for (let cwd = directory; found.length < limit; cwd = path.dirname(cwd)) {
    const { result, stop } = await runMatcher({ ...options, cwd });
    if (result && !unique.has(result)) {
      found.push(result);
      unique.add(result);
      yield result;
    }
    if (stop || cwd === stopAt || cwd === root) break;
  }
};

function toPath(urlOrPath: URL | string | undefined) {
  return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}

function normalise(options: Options) {
  const directory = path.resolve(toPath(options.cwd) ?? '');
  const { root } = path.parse(directory);
  const stopAt = path.resolve(directory, toPath(options.stopAtPath) ?? root);
  const limit = options.stopAtLimit ?? Number.POSITIVE_INFINITY;
  return { directory, stopAt, root, limit };
}

async function getRunMatcher(name: string | readonly string[] | Matcher, options: Options) {
  const { absolute, relative, matcher } = normaliseName(name);
  const found = [];
  if (absolute)
    for (const n of absolute) {
      const p = await locatePath([n], options);
      if (p) found.push(p);
    }
  const runMatcher = async (opt: Options) => {
    if (matcher) {
      assertIsString(opt.cwd);
      const p = matcher(opt.cwd);
      return typeof p === 'string' ? { result: await locatePath([p], opt) } : {};
    }
    return { result: await locatePath(relative, opt), stop: relative.length < 1 };
  };
  return { found, runMatcher };
}

getRunMatcher.sync = (name: string | readonly string[] | Matcher, options: Options) => {
  const { absolute, relative, matcher } = normaliseName(name);
  const found = absolute?.map(n => locatePath.sync([n], options)).filter(isNonNull) ?? [];
  const runMatcher = (opt: Options) => {
    if (matcher) {
      assertIsString(opt.cwd);
      const p = matcher(opt.cwd);
      return typeof p === 'string' ? { result: locatePath.sync([p], opt) } : {};
    }
    return { result: locatePath.sync(relative, opt), stop: relative.length < 1 };
  };
  return { found, runMatcher };
};

function normaliseName(name: string | readonly string[] | Matcher) {
  if (typeof name !== 'function') {
    const [absolute, relative] = [name].flat().reduce<Set<string>[]>(
      (r, n) => {
        if (path.isAbsolute(n)) r[0].add(path.normalize(n));
        else r[1].add(n);
        return r;
      },
      [new Set(), new Set()],
    );
    return { absolute: [...absolute], relative: [...relative] };
  }
  return { matcher: name };
}

async function locatePath(names: string[], { cwd, allowSymlinks, type }: Options) {
  assertIsString(cwd);
  const fstat = getFstat(allowSymlinks !== false);
  for (const name of names) {
    const fname = path.resolve(cwd, name);
    const stat = await fstat(fname);
    if (checkType(stat, type ?? 'file')) return fname;
  }
  return undefined;
}

locatePath.sync = (names: string[], { cwd, allowSymlinks, type }: Options) => {
  assertIsString(cwd);
  const fstat = getFstat.sync(allowSymlinks !== false);
  for (const name of names) {
    const fname = path.resolve(cwd, name);
    const stat = fstat(fname);
    if (checkType(stat, type ?? 'file')) return fname;
  }
  return undefined;
};

function getFstat(allowSymlinks: boolean) {
  const fstat = allowSymlinks ? promises.stat : promises.lstat;
  return async (fname: string) => {
    try {
      return await fstat(fname); // Need to await if there is an error
    } catch {
      return undefined;
    }
  };
}

getFstat.sync = (allowSymlinks: boolean) => {
  const fstat = allowSymlinks ? fs.statSync : fs.lstatSync;
  return (fname: string) => {
    try {
      return fstat(fname);
    } catch {
      return undefined;
    }
  };
};

function checkType(stat: Stats | undefined, type: Options['type']) {
  if (!stat) return false;
  switch (type) {
    case 'file':
      return stat.isFile();
    case 'directory':
      return stat.isDirectory();
  }
  throw Error(`Invalid type: ${type}`);
}
