import fs, {
  promises,
  Stats,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assertIsString } from '@dozerg/condition';

type Matcher = (directory: string) => string | Promise<string> | undefined;
// type Callback = (pathname: string) => void;

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

export default async function findUp(
  name: string | readonly string[] | Matcher,
  options: Options = {},
) {
  const { directory, stopAt, limit } = normalise(options);
  const runMatcher = getRunMatcher(name);
  const matches = [];
  for (let cwd = directory; cwd !== stopAt && matches.length < limit; cwd = path.dirname(cwd)) {
    const foundPath = await runMatcher({ ...options, cwd });
    if (foundPath) matches.push(path.resolve(cwd, foundPath));
  }
  return matches;
}

findUp.sync = (name: string | readonly string[] | Matcher, options: Options = {}) => {
  const { directory, stopAt, limit } = normalise(options);
  const runMatcher = getRunMatcher.sync(name);
  const matches = [];
  for (let cwd = directory; cwd !== stopAt && matches.length < limit; cwd = path.dirname(cwd)) {
    const foundPath = runMatcher({ ...options, cwd });
    if (foundPath) matches.push(path.resolve(cwd, foundPath));
  }
  return matches;
};

// findUp.callback = (
//   name: string | readonly string[] | Matcher,
//   callback: Callback,
//   option?: Options,
// ) => {
//   // TODO
//   return;
// };

// findUp.generate = async function* (name: string | string[] | Matcher, options: Options = {}) {
//   // TODO
//   for (const n of []) {
//     yield '';
//   }
// };

function toPath(urlOrPath: URL | string | undefined) {
  return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}

function normalise(options: Options) {
  const directory = path.resolve(toPath(options.cwd) ?? '');
  const { root } = path.parse(directory);
  const stopAt = path.resolve(directory, toPath(options.stopAtPath) ?? root);
  const limit = options.stopAtLimit || Number.POSITIVE_INFINITY;
  return { directory, stopAt, limit };
}

function getRunMatcher(name: string | readonly string[] | Matcher) {
  return async (options: Options) => {
    if (typeof name !== 'function') return locatePath([name].flat(), options);
    assertIsString(options.cwd);
    const foundPath = await name(options.cwd);
    if (typeof foundPath === 'string') return locatePath([foundPath], options);
    return undefined;
  };
}

getRunMatcher.sync = (name: string | readonly string[] | Matcher) => {
  return (options: Options) => {
    if (typeof name !== 'function') return locatePath.sync([name].flat(), options);
    assertIsString(options.cwd);
    const foundPath = name(options.cwd);
    if (typeof foundPath === 'string') return locatePath.sync([foundPath], options);
    return undefined;
  };
};

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
      return fstat(fname);
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
