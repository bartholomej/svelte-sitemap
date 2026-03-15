import { distPackage } from 'rolldown-plugin-dist-package';
import { defineConfig } from 'tsdown';

const outDir = 'dist';

export default defineConfig([
  {
    entry: ['src/index.ts', './src/cli.ts'],
    format: ['esm'],
    target: 'es2022',
    dts: true,
    clean: true,
    outDir: outDir,
    sourcemap: true,
    exports: true,
    unbundle: true,
    fixedExtension: false,
    plugins: [
      distPackage({
        outDir,
        removeFields: ['packageManager', 'lint-staged', 'devDependencies', 'scripts'],
        copyFiles: ['README.md', 'LICENSE'],
        validate: true
      })
    ]
  }
]);
