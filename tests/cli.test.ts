import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { describe, expect, test } from 'vitest';

const CLI_PATH = join(__dirname, '../src/cli.ts');
const TSX_CMD = `npx tsx ${CLI_PATH}`;

function runCli(args: string, cwd?: string) {
  try {
    const stdout = execSync(`${TSX_CMD} ${args}`, { cwd, stdio: 'pipe' });
    return { stdout: stdout.toString(), stderr: '', status: 0 };
  } catch (e: any) {
    return {
      stdout: e.stdout?.toString() || '',
      stderr: e.stderr?.toString() || '',
      status: e.status
    };
  }
}

describe('CLI tests', () => {
  test('should show help when --help is passed', () => {
    const { stdout, stderr } = runCli('--help');
    expect(stdout + stderr).toContain('Svelte `sitemap.xml` generator');
    expect(stdout + stderr).toContain('Options:');
  });

  test('should show version when --version is passed', () => {
    const { stdout, stderr } = runCli('--version');
    expect(stdout + stderr).toMatch(/svelte-sitemap \d+\.\d+\.\d+/);
  });

  test('should fail when no domain is provided (CLI)', () => {
    const tempDir = join(__dirname, 'temp-cli-test-1');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      const { stdout, stderr } = runCli('', tempDir);
      expect(stdout + stderr).toContain('--domain argument is required');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should fail when domain does not start with https://', () => {
    const tempDir = join(__dirname, 'temp-cli-test-2');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      const { stdout, stderr } = runCli('--domain http://example.com', tempDir);
      expect(stdout + stderr).toContain('--domain argument must start with https://');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should warn on unknown CLI arguments', () => {
    const tempDir = join(__dirname, 'temp-cli-test-3');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      const { stdout, stderr } = runCli('--unknown-arg', tempDir);
      expect(stdout + stderr).toContain('This argument is not supported');
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should read config file and ignore CLI options', () => {
    const tempDir = join(__dirname, 'temp-cli-test-options');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      writeFileSync(
        join(tempDir, 'svelte-sitemap.config.js'),
        `export default { domain: 'https://example-config.com' }`
      );

      const { stdout, stderr } = runCli('--domain https://cli-domain.com --reset-time', tempDir);
      const out = stdout + stderr;

      expect(out).toContain('Reading config file');
      expect(out).toContain("CLI options (arguments with '--'), but they are ignored");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should fail when config file misses domain', () => {
    const tempDir = join(__dirname, 'temp-cli-test-missing-domain');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      writeFileSync(
        join(tempDir, 'svelte-sitemap.config.js'),
        `export default { outDir: 'build' }`
      );

      const { stdout, stderr } = runCli('', tempDir);
      const out = stdout + stderr;

      expect(out).toContain('Reading config file');
      expect(out).toContain("domain' property is required in your config file");
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  test('should warn on invalid properties in config file', () => {
    const tempDir = join(__dirname, 'temp-cli-test-invalid-prop');
    if (!existsSync(tempDir)) mkdirSync(tempDir);
    try {
      writeFileSync(
        join(tempDir, 'svelte-sitemap.config.js'),
        `export default { domain: 'https://example.com', invalidProp: true, nope: 123 }`
      );

      const { stdout, stderr } = runCli('', tempDir);
      const out = stdout + stderr;

      expect(out).toContain('Reading config file');
      expect(out).toContain(
        'Invalid properties in config file, so I ignore them: invalidProp, nope'
      );
    } finally {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
