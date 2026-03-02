import { createJiti } from 'jiti';
const jiti = createJiti(__filename);

async function run() {
  const result = await jiti.import('./svelte-sitemap.js', { default: true });
  console.log(result);
}
run();
