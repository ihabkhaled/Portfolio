import { Buffer } from 'node:buffer';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

import {
  digest,
  FONT_DIRECTORY,
  FONT_WEIGHTS,
  readLocaleRecords,
  SOCIAL_IMAGE_DIRECTORY,
} from './social-asset-config.mjs';

const MANIFEST_PATH = path.join(SOCIAL_IMAGE_DIRECTORY, 'manifest.json');
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SOCIAL_CARD_PATH = path.join(path.dirname(SCRIPT_PATH), 'assets/ihab-social-card.jpg');
const WRITE_MODE = process.argv.includes('--write');
const PAGE_MARKUP = `<!doctype html>
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <main>
      <section class="copy">
        <p id="eyebrow"></p>
        <h1 id="title"></h1>
        <p id="role"></p>
        <div class="rule"></div>
        <div id="features"></div>
        <div id="technologies"></div>
        <code id="locale"></code>
      </section>
      <figure><img id="portrait" alt=""></figure>
    </main>
  </body>
</html>`;
const PAGE_STYLES = `
  * { box-sizing: border-box; }
  html, body { height: 630px; margin: 0; width: 1200px; }
  body { background: #071322; overflow: hidden; }
  main {
    background: linear-gradient(135deg, #071322 0%, #0a1f39 72%, #0b4f91 100%);
    color: #f7f8fa;
    display: flex;
    gap: 34px;
    height: 630px;
    padding: 38px 40px;
    width: 1200px;
  }
  .copy { display: flex; flex: 1; flex-direction: column; min-width: 0; padding-top: 34px; }
  [dir="rtl"] .copy { text-align: right; }
  p, h1 { margin: 0; }
  #eyebrow { color: #58bbff; font-size: 15px; font-weight: 800; letter-spacing: .06em; }
  h1 { font-size: 50px; font-weight: 900; letter-spacing: -.025em; line-height: 1.02; margin-top: 18px; }
  #role { color: #58bbff; font-size: 24px; font-weight: 800; line-height: 1.2; margin-top: 10px; }
  .rule { background: #58bbff; height: 3px; margin-top: 18px; width: 100%; }
  #features { color: #d8e2ef; display: grid; font-size: 18px; gap: 9px; line-height: 1.25; margin-top: 20px; }
  #technologies { display: grid; gap: 10px; grid-template-columns: repeat(4, minmax(0, 1fr)); margin-top: 22px; }
  .technology { background: #1765bd; border-radius: 22px; color: #f7f8fa; font-size: 14px; font-weight: 800; padding: 9px 8px; text-align: center; }
  code { color: #8ecfff; direction: ltr; font-family: inherit; font-size: 14px; font-weight: 800; margin-top: auto; unicode-bidi: isolate; }
  figure { border: 2px solid #1765ad; border-radius: 34px; height: 554px; margin: 0; overflow: hidden; width: 465px; }
  #portrait { display: block; height: 100%; object-fit: cover; object-position: right center; width: 100%; }
`;

async function buildFontStyles(locale) {
  const rules = [];
  for (const weight of FONT_WEIGHTS) {
    const data = await readFile(path.join(FONT_DIRECTORY, `${locale}-${weight}.ttf`));
    rules.push(
      `@font-face { font-family: SocialNoto; font-style: normal; font-weight: ${weight}; ` +
        `src: url(data:font/ttf;base64,${data.toString('base64')}) format('truetype'); }`,
    );
  }
  return `${rules.join('\n')}\n${PAGE_STYLES}\nmain { font-family: SocialNoto, sans-serif; }`;
}

async function writeImages(records, generatorHash) {
  await mkdir(SOCIAL_IMAGE_DIRECTORY, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const socialCard = await readFile(SOCIAL_CARD_PATH);
  const socialCardUrl = `data:image/jpeg;base64,${socialCard.toString('base64')}`;
  const manifest = {
    generatedBy: 'npm run assets:social:generate',
    generatorHash,
    locales: {},
  };
  try {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    for (const record of records) {
      await page.setContent(PAGE_MARKUP);
      await page.addStyleTag({ content: await buildFontStyles(record.locale) });
      await page.evaluate((value) => {
        globalThis.document.documentElement.dir = value.direction;
        globalThis.document.documentElement.lang = value.locale;
        globalThis.document.querySelector('#eyebrow').textContent = value.copy.eyebrow;
        globalThis.document.querySelector('#title').textContent = value.copy.title;
        globalThis.document.querySelector('#role').textContent = value.copy.role;
        globalThis.document.querySelector('#features').replaceChildren(
          ...value.copy.featureRows.map((text) => {
            const row = globalThis.document.createElement('p');
            row.textContent = text;
            return row;
          }),
        );
        globalThis.document.querySelector('#technologies').replaceChildren(
          ...value.copy.technologies.map((text) => {
            const technology = globalThis.document.createElement('span');
            technology.className = 'technology';
            technology.textContent = text;
            return technology;
          }),
        );
        globalThis.document.querySelector('#locale').textContent = `/${value.locale}`;
      }, record);
      await page.locator('#portrait').evaluate((image, source) => {
        image.src = source;
      }, socialCardUrl);
      await page.locator('#portrait').evaluate((image) => image.decode());
      await page.evaluate(() => globalThis.document.fonts.ready);
      const imagePath = path.join(SOCIAL_IMAGE_DIRECTORY, `${record.locale}.png`);
      await page.screenshot({ path: imagePath, type: 'png' });
      const image = await readFile(imagePath);
      manifest.locales[record.locale] = {
        imageHash: digest(image),
        messageHash: record.messageHash,
      };
    }
  } finally {
    await browser.close();
  }
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
}

async function verifyImages(records, generatorHash) {
  const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
  if (manifest.generatorHash !== generatorHash) {
    throw new Error('Social image generator changed. Run npm run assets:social:generate.');
  }
  for (const record of records) {
    const entry = manifest.locales?.[record.locale];
    const image = await readFile(path.join(SOCIAL_IMAGE_DIRECTORY, `${record.locale}.png`));
    if (entry?.messageHash !== record.messageHash || entry.imageHash !== digest(image)) {
      throw new Error(
        `${record.locale} social image is stale. Run npm run assets:social:generate.`,
      );
    }
  }
}

const records = await readLocaleRecords();
const generatorHash = digest(
  Buffer.concat([await readFile(SCRIPT_PATH), await readFile(SOCIAL_CARD_PATH)]),
);
const processImages = WRITE_MODE ? writeImages : verifyImages;

await processImages(records, generatorHash);
