export const cliColors = {
  cyanAndBold: '\x1b[36m\x1b[1m%s\x1b[22m\x1b[0m',
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m',
  yellow: '\x1b[33m%s\x1b[0m'
};

export const successMsg = (outDir: string, filename: string) =>
  `  ✔ Done. Check your new sitemap here: ./${outDir}/${filename}`;

export const errorMsgWrite = (outDir: string, filename: string) =>
  `  × File '${outDir}/${filename}' could not be created.`;

export const errorMsgGeneration = `  × Sitemap generation failed.`;

export const errorMsgFolder = (outDir: string) =>
  `  × Folder '${outDir}/' doesn't exist.\n` +
  `    Make sure your build completed successfully and the output folder was created.\n` +
  `    If you are using SvelteKit, ensure you are using adapter-static and your outDir matches the adapter's output folder. See https://github.com/bartholomej/svelte-sitemap#-error-missing-folder`;

export const errorMsgHtmlFiles = (outDir: string) =>
  `  × There is no static html file in your '${outDir}/' folder.\n` +
  `    This generator requires static HTML files to scan. If you are using adapter-static, make sure you have prerendering enabled.\n` +
  `    If you are building a fully dynamic SSR site, you should generate your sitemap dynamically (e.g., via a +server.ts route) instead. See https://github.com/bartholomej/svelte-sitemap#-error-missing-html-files`;
