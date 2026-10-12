import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { consume, produce, run } from './handoff.mjs';

const script = fileURLToPath(new URL('./handoff.mjs', import.meta.url));
const content = '# Project Handoff\n\n## Task\n继续未完成的模块，不扩大范围。\n';

function git(root, args) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout;
}

function fixture(t) {
  const base = path.resolve('temp');
  fs.mkdirSync(base, { recursive: true });
  const root = fs.mkdtempSync(path.join(base, 'handoff-test-'));
  t.after(() => {
    assert.equal(path.dirname(root), base);
    // Windows 上刚访问过的 Git 目录可能仍被扫描，清理只做有界重试。
    fs.rmSync(root, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  });
  git(root, ['init', '--quiet']);
  fs.mkdirSync(path.join(root, 'temp'));
  const draft = path.join(root, 'temp', 'draft.md');
  const target = path.join(root, '.ai', 'HANDOFF.local.md');
  fs.writeFileSync(draft, content);
  return { root, draft, target };
}

test('produce publishes UTF-8, excludes handoff locally and removes draft', (t) => {
  const { root, draft, target } = fixture(t);
  const result = produce(root, draft);
  assert.equal(result.status, 'produced');
  assert.equal(fs.readFileSync(target, 'utf8'), content);
  assert.equal(fs.existsSync(draft), false);
  assert.equal(git(root, ['check-ignore', '--', '.ai/HANDOFF.local.md']).trim(), '.ai/HANDOFF.local.md');
  assert.equal(fs.existsSync(path.join(root, '.gitignore')), false);
});

test('consume delivers exact content and deletes in the same operation', async (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  await consume(root, async (value) => {
    assert.equal(value.content, content);
    assert.equal(value.sha256.length, 64);
    assert.equal(fs.existsSync(target), true);
  });
  assert.equal(fs.existsSync(target), false);
  await assert.rejects(consume(root, async () => {}), /ENOENT/);
});

test('failed output preserves handoff', async (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  await assert.rejects(run(['consume', '--project', root], {
    write(_data, callback) { callback(new Error('output failed')); },
  }), /output failed/);
  assert.equal(fs.readFileSync(target, 'utf8'), content);
});

test('a newer handoff during delivery is not deleted', async (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  await assert.rejects(consume(root, async () => {
    fs.writeFileSync(target, 'new handoff');
  }), /changed during delivery/);
  assert.equal(fs.readFileSync(target, 'utf8'), 'new handoff');
});

test('empty or invalid UTF-8 consumption retains the source', async (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  for (const data of [Buffer.from('  '), Buffer.from([0xff])]) {
    fs.writeFileSync(target, data);
    await assert.rejects(consume(root, async () => assert.fail('Should not deliver')));
    assert.deepEqual(fs.readFileSync(target), data);
  }
});

test('tracked handoff cannot be produced over or consumed', async (t) => {
  const { root, draft, target } = fixture(t);
  fs.mkdirSync(path.dirname(target));
  fs.writeFileSync(target, 'tracked content');
  git(root, ['add', '.ai/HANDOFF.local.md']);
  assert.throws(() => produce(root, draft), /tracked/);
  await assert.rejects(consume(root, async () => {}), /tracked/);
  assert.equal(fs.readFileSync(target, 'utf8'), 'tracked content');
  assert.equal(fs.existsSync(draft), true);
});

test('produce replaces the old untracked handoff without duplicate exclusions', (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  const exclude = path.join(root, '.git', 'info', 'exclude');
  const previous = fs.readFileSync(exclude, 'utf8');
  fs.writeFileSync(draft, 'replacement');
  produce(root, draft);
  assert.equal(fs.readFileSync(target, 'utf8'), 'replacement');
  assert.equal(fs.readFileSync(exclude, 'utf8'), previous);
  assert.deepEqual(fs.readdirSync(path.dirname(target)), ['HANDOFF.local.md']);
});

test('empty or out-of-temp drafts are rejected without deleting them', (t) => {
  const { root, draft, target } = fixture(t);
  fs.writeFileSync(draft, ' ');
  assert.throws(() => produce(root, draft), /Empty/);
  const other = path.join(root, 'important.md');
  fs.writeFileSync(other, content);
  assert.throws(() => produce(root, other), /temp directory/);
  assert.equal(fs.existsSync(other), true);
  assert.equal(fs.existsSync(draft), true);
  assert.equal(fs.existsSync(target), false);
});

test('CLI round trip produces a JSON handoff and consumes it once', (t) => {
  const { root, draft, target } = fixture(t);
  const produced = spawnSync(process.execPath, [script, 'produce', '--project', root, '--input', draft], { encoding: 'utf8' });
  assert.equal(produced.status, 0, produced.stderr);
  assert.equal(JSON.parse(produced.stdout).status, 'produced');
  const consumed = spawnSync(process.execPath, [script, 'consume', '--project', root], { encoding: 'utf8' });
  assert.equal(consumed.status, 0, consumed.stderr);
  assert.equal(JSON.parse(consumed.stdout).content, content);
  assert.equal(fs.existsSync(target), false);
});

test('invalid commands and argument combinations do not alter the handoff', async (t) => {
  const { root, draft, target } = fixture(t);
  produce(root, draft);
  for (const args of [['delete', '--project', root], ['consume', '--project', root, '--input', draft], ['produce', '--project', root], ['consume', '--project', root, '--unknown', 'x']]) {
    await assert.rejects(run(args));
    assert.equal(fs.existsSync(target), true);
  }
});

test('Git worktree uses the actual local exclude and leaves tracked ignore untouched', async (t) => {
  const { root } = fixture(t);
  git(root, ['-c', 'user.name=Test', '-c', 'user.email=test@example.invalid', 'commit', '--allow-empty', '--quiet', '-m', 'fixture']);
  const linked = path.join(root, 'linked-worktree');
  git(root, ['worktree', 'add', '--detach', '--quiet', linked]);
  fs.mkdirSync(path.join(linked, 'temp'));
  const draft = path.join(linked, 'temp', 'draft.md');
  fs.writeFileSync(draft, content);
  produce(linked, draft);
  assert.equal(fs.statSync(path.join(linked, '.git')).isFile(), true);
  assert.equal(git(linked, ['check-ignore', '--', '.ai/HANDOFF.local.md']).trim(), '.ai/HANDOFF.local.md');
  await consume(linked, async (value) => assert.equal(value.content, content));
  assert.equal(fs.existsSync(path.join(linked, '.ai', 'HANDOFF.local.md')), false);
});

test('a non-Git project round trip does not invent Git metadata', (t) => {
  const { root, draft, target } = fixture(t);
  fs.rmSync(path.join(root, '.git'), { recursive: true, force: true });
  const env = { ...process.env, GIT_CEILING_DIRECTORIES: path.dirname(root) };
  for (const args of [['produce', '--project', root, '--input', draft], ['consume', '--project', root]]) {
    const result = spawnSync(process.execPath, [script, ...args], { env, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  }
  assert.equal(fs.existsSync(target), false);
  assert.equal(fs.existsSync(path.join(root, '.git')), false);
});
