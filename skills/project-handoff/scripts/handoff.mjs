import { createHash, randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { pathToFileURL } from 'node:url';

const relativeFile = '.ai/HANDOFF.local.md';
const digest = (data) => createHash('sha256').update(data).digest('hex');

function regularFile(file) {
  const stat = fs.lstatSync(file);
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Expected a regular file: ' + file);
}

function git(project, args) {
  const result = spawnSync('git', args, { cwd: project, encoding: 'utf8' });
  if (result.error) throw result.error;
  return result;
}

function workspace(project) {
  const root = fs.realpathSync(project);
  const directory = path.join(root, '.ai');
  if (fs.existsSync(directory)) {
    const stat = fs.lstatSync(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('.ai must be a real directory');
  }
  const target = path.join(root, relativeFile);
  if (fs.existsSync(target)) regularFile(target);
  const repository = git(root, ['rev-parse', '--show-toplevel']);
  const isGit = repository.status === 0;
  if (isGit) {
    if (fs.realpathSync(repository.stdout.trim()) !== root) throw new Error('--project must be the Git root');
    const tracked = git(root, ['ls-files', '--', relativeFile]);
    if (tracked.status !== 0) throw new Error(tracked.stderr.trim());
    if (tracked.stdout.trim()) throw new Error('Handoff path is tracked by Git; leave it unchanged');
  }
  return { root, directory, target, isGit };
}

export function produce(project, input) {
  const { root, directory, target, isGit } = workspace(project);
  const source = fs.realpathSync(input);
  const draftRelative = path.relative(path.join(root, 'temp'), source);
  if (!draftRelative || draftRelative.startsWith('..') || path.isAbsolute(draftRelative)) {
    throw new Error('--input must be a draft inside the project temp directory');
  }
  regularFile(input);
  const data = fs.readFileSync(source);
  if (!new TextDecoder('utf-8', { fatal: true }).decode(data).trim()) throw new Error('Empty handoff draft');
  if (isGit && git(root, ['check-ignore', '-q', '--', relativeFile]).status !== 0) {
    const result = git(root, ['rev-parse', '--git-path', 'info/exclude']);
    if (result.status !== 0) throw new Error(result.stderr.trim());
    const exclude = path.resolve(root, result.stdout.trim());
    const previous = fs.existsSync(exclude) ? fs.readFileSync(exclude, 'utf8') : '';
    fs.mkdirSync(path.dirname(exclude), { recursive: true });
    fs.writeFileSync(exclude, previous + (previous && !previous.endsWith('\n') ? '\n' : '') + '/' + relativeFile + '\n');
    if (git(root, ['check-ignore', '-q', '--', relativeFile]).status !== 0) throw new Error('Handoff is not ignored by Git');
  }
  fs.mkdirSync(directory, { recursive: true });
  const temporary = path.join(directory, '.handoff-' + randomUUID() + '.tmp');
  try {
    fs.writeFileSync(temporary, data, { flag: 'wx' });
    fs.renameSync(temporary, target);
  } finally {
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
  fs.unlinkSync(source);
  return { status: 'produced', path: target, sha256: digest(data) };
}

export async function consume(project, deliver) {
  const { target } = workspace(project);
  regularFile(target);
  const data = fs.readFileSync(target);
  const content = new TextDecoder('utf-8', { fatal: true }).decode(data);
  if (!content.trim()) throw new Error('Empty handoff; file retained');
  // 输出成功前不删除；输出期间被更新的交接也必须保留。
  await deliver({ path: target, sha256: digest(data), content });
  regularFile(target);
  if (!fs.readFileSync(target).equals(data)) throw new Error('Handoff changed during delivery; file retained');
  fs.unlinkSync(target);
}

export async function run(argv, output = process.stdout) {
  const [command, ...args] = argv;
  if (!['produce', 'consume'].includes(command)) throw new Error('Expected produce or consume');
  const options = {};
  for (let index = 0; index < args.length; index += 2) {
    const key = args[index];
    if (!['--project', '--input'].includes(key) || !args[index + 1] || options[key]) throw new Error('Invalid arguments');
    options[key] = args[index + 1];
  }
  if (!options['--project'] || (command === 'produce') !== Boolean(options['--input'])) throw new Error('Expected --project; produce also requires --input');
  const send = (value) => new Promise((resolve, reject) => {
    output.write(JSON.stringify(value) + '\n', (error) => error ? reject(error) : resolve());
  });
  if (command === 'produce') await send(produce(options['--project'], options['--input']));
  else await consume(options['--project'], send);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  process.stdout.on('error', () => {});
  run(process.argv.slice(2)).catch((error) => {
    process.stderr.write(error.message + '\n');
    process.exitCode = 1;
  });
}
