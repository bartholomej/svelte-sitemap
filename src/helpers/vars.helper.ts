export const cliColors = {
  cyanAndBold: '\x1b[36m\x1b[1m%s\x1b[22m\x1b[0m',
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m'
};

export const successMsg = (outDir: string, filename: string) =>
  `  ✔ done. Check your new sitemap here: ./${outDir}/${filename}`;

export const errorMsgWrite = (outDir: string, filename: string) =>
  `  × File '${outDir}/${filename}' could not be created.`;

export const errorMsgFolder = (outDir: string) =>
  `  × Folder '${outDir}/' doesn't exist.\n    Make sure you are using this library as 'postbuild' so '${outDir}/' folder was successfully created before running this script. Or are you using Vercel? See https://github.com/bartholomej/svelte-sitemap#error-missing-folder`;

export const errorMsgHtmlFiles = (outDir: string) =>
  `  × There is no static html file in your '${outDir}/' folder. Are you sure you are using Svelte adapter-static with prerender option? See https://github.com/bartholomej/svelte-sitemap#error-missing-html-files`;
