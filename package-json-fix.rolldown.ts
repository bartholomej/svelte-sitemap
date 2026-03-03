import fs from 'fs';
import path from 'path';
import { Plugin } from 'rolldown';

export function copyAndFixPackageJson({
  outDir,
  removeFields,
  noPrefix
}: {
  outDir: string;
  removeFields?: string[];
  noPrefix?: string[];
}): Plugin {
  return {
    name: 'copy-and-fix-package-json',
    // Runs at the very end, after all outputs
    closeBundle() {
      const root = process.cwd();
      const src = path.join(root, 'package.json');
      const destDir = path.join(root, outDir);
      const dest = path.join(destDir, 'package.json');

      if (!fs.existsSync(src)) {
        console.error('❌ package.json not found');
        return;
      }

      let pkg = JSON.parse(fs.readFileSync(src, 'utf8'));

      pkg = removeOutDir(pkg, outDir, noPrefix || ['bin']);

      // Clean up unnecessary fields
      for (const field of removeFields || []) {
        delete pkg[field];
      }

      // Save new package.json to dist/
      fs.mkdirSync(destDir, { recursive: true });
      fs.writeFileSync(dest, JSON.stringify(pkg, null, 2));

      console.log('✅ package.json copied and cleaned in dist/');
    }
  };
}

type JsonValue = string | number | boolean | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

function removeOutDir(
  obj: JsonValue,
  outDir: string,
  noPrefixFields: string[] = [],
  inheritedSkip: boolean = false
): JsonValue {
  if (typeof obj === 'string') {
    const prefix = `./${outDir}/`;
    if (obj.startsWith(prefix)) {
      // Remove the outDir prefix and normalize the path
      let cleaned = obj.slice(prefix.length);
      cleaned = path.posix.normalize(cleaned);

      if (inheritedSkip) {
        return cleaned;
      }

      // The path must start with ./ if it's relative
      cleaned = cleaned ? `./${cleaned}` : './';
      return cleaned;
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeOutDir(item, outDir, noPrefixFields, inheritedSkip));
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      const willSkip = inheritedSkip || noPrefixFields.includes(key);
      newObj[key] = removeOutDir(obj[key], outDir, noPrefixFields, willSkip);
    }
    return newObj;
  }

  return obj;
}
