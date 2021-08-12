export const cliColors = {
  cyanAndBold: '\x1b[36m\x1b[1m%s\x1b[22m\x1b[0m',
  green: '\x1b[32m%s\x1b[0m',
  red: '\x1b[31m%s\x1b[0m'
};

export const successMsg = (outDir: string) =>
  `  ✔ done. Check your new sitemap here: ./${outDir}/sitemap.xml`;

export const errorMsg = (outDir: string) =>
  `  × Make sure you are using this script as 'postbuild' so '${outDir}' folder was sucefully created before running this script. See https://github.com/bartholomej/svelte-sitemap#readme`;
