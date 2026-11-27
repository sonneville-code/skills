import { execFileSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const usage = 'Usage: workspaces.mjs list [--include-background] | labels | add-label WORKSPACE_ID LABEL [COLOR]';
const colors = new Set(['violet', 'sky', 'emerald', 'orange', 'pink', 'indigo', 'teal', 'red', 'amber', 'blue']);

function loadSdk() {
  const version = execFileSync('paseo', ['--version'], { encoding: 'utf8' }).trim();
  if (!/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version)) {
    throw new Error('Expected a version from paseo --version.');
  }
  const cacheDir = join(process.env.XDG_CACHE_HOME || join(homedir(), '.cache'), 'paseo-workspace-api', version);
  mkdirSync(cacheDir, { recursive: true });
  const resolve = createRequire(join(cacheDir, 'package.json')).resolve;
  try {
    return import(pathToFileURL(resolve('@getpaseo/client/node')));
  } catch (error) {
    if (error.code !== 'MODULE_NOT_FOUND') throw error;
    execFileSync('npm', ['install', '--prefix', cacheDir, '--ignore-scripts', '--no-audit', '--no-fund', `@getpaseo/client@${version}`], {
      stdio: ['ignore', 'ignore', 'inherit'],
    });
    return import(pathToFileURL(resolve('@getpaseo/client/node')));
  }
}

async function main() {
  const [command, first, second, color = 'sky', ...extra] = process.argv.slice(2);
  const args = process.argv.slice(3);
  const includeBackground = command === 'list' && first === '--include-background';
  const validList = command === 'list' && (args.length === 0 || (includeBackground && args.length === 1));
  const validLabels = command === 'labels' && args.length === 0;
  const validAdd = command === 'add-label' && /^wks_[a-z0-9]+$/i.test(first ?? '') &&
    second?.trim() && colors.has(color) && extra.length === 0;
  if (!validList && !validLabels && !validAdd) throw new Error(usage);

  const status = JSON.parse(execFileSync('paseo', ['status', '--json'], { encoding: 'utf8' }));
  const port = /^(?:[^\s/:]+|\[[^\]]+\]):(\d+)$/.exec(status.listen ?? '')?.[1];
  if (status.localDaemon !== 'running' || !port || !status.home) {
    throw new Error('No running local Paseo daemon with a TCP listener. Check paseo status --json.');
  }
  const { createHostClient } = await loadSdk();
  const client = createHostClient(`127.0.0.1:${port}`, {
    clientId: randomUUID(),
    clientType: 'cli',
    connectTimeoutMs: 5000,
    localCredential: async () => (await readFile(join(status.home, 'local-credential'), 'utf8')).trim(),
  });

  try {
    await client.connect();
    if (validLabels) return (await client.listWorkspaceLabels()).labels;

    const { entries } = await client.fetchWorkspaces({ includeBackground: includeBackground || validAdd });
    if (validList) {
      return entries.filter(workspace => includeBackground || !workspace.background).map(workspace => ({
        id: workspace.id,
        project: workspace.projectDisplayName,
        title: workspace.title ?? workspace.name,
        directory: workspace.workspaceDirectory,
        status: workspace.status,
        labels: workspace.labels ?? [],
        background: workspace.background,
      }));
    }

    const target = entries.find(workspace => workspace.id === first);
    if (!target) throw new Error(`Active workspace not found: ${first}`);
    const requested = second.trim();
    const { labels } = await client.listWorkspaceLabels();
    const label = labels.find(entry => entry.name.toLowerCase() === requested.toLowerCase()) ??
      { name: requested, color };
    const before = target.labels ?? [];
    if (before.includes(label.name)) return { id: first, changed: false, labels: before };

    const result = await client.setWorkspaceLabel({ workspaceId: first, label, assigned: true });
    const refreshed = await client.fetchWorkspaces({ includeBackground: true });
    const saved = refreshed.entries.find(workspace => workspace.id === first)?.labels;
    if (!saved || ![...before, result.label.name].every(name => saved.includes(name))) {
      throw new Error(`Couldn't verify saved labels for ${first}.`);
    }
    return { id: first, changed: true, labels: saved };
  } finally {
    await client.close();
  }
}

try {
  console.log(JSON.stringify(await main()));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
