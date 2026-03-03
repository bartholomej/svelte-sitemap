import { defineConfig } from 'tsdown';
import { copyAndFixPackageJson } from './package-json-fix.rolldown';
// import { copyAndFixPackageJson } from './package-json-fix.rolldown';

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
      copyAndFixPackageJson({
        outDir,
        removeFields: ['packageManager', 'lint-staged', 'devDependencies', 'scripts']
      })
    ]
  }
]);
