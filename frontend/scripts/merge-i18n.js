const fs = require('fs');
const path = require('path');

const supportedLangs = ['en', 'fr'];
const rootDir = path.resolve(__dirname, '../src/app');
const outputDir = path.resolve(__dirname, '../public/i18n');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function mergeDeep(target, source) {
  for (const key of Object.keys(source)) {
    if (
      source[key] instanceof Object &&
      key in target &&
      target[key] instanceof Object
    ) {
      Object.assign(source[key], mergeDeep(target[key], source[key]));
    }
  }
  return { ...target, ...source };
}

supportedLangs.forEach((lang) => {
  let merged = {};

  function search(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        search(fullPath);
      } else if (file === `${lang}.json` && dir.includes('/i18n')) {
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
        merged = mergeDeep(merged, content);
      }
    }
  }

  search(rootDir);

  fs.writeFileSync(
    path.join(outputDir, `${lang}.json`),
    JSON.stringify(merged, null, 2),
    'utf-8'
  );

  console.log(`✅ Merged ${lang}.json`);
});
