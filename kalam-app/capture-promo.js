const puppeteer = require('puppeteer');
const path = require('path');

async function captureHTML(page, htmlFile, outputFile) {
  const htmlPath = path.resolve(__dirname, htmlFile);
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });

  await page.setViewport({ width: 1080, height: 1080 });

  const banner = await page.$('#banner');
  const box = await banner.boundingBox();

  await page.setViewport({ width: 1080, height: Math.ceil(box.height) });

  const outPath = path.resolve(__dirname, outputFile);
  await banner.screenshot({
    path: outPath,
    type: 'jpeg',
    quality: 95,
  });

  console.log(`✔ ${outputFile} — ${Math.ceil(box.width)}x${Math.ceil(box.height)}px`);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  await captureHTML(page, 'src/assets/promo-banner.html', 'src/assets/kalam-promo-banner.jpg');
  await captureHTML(page, 'src/assets/subscription-plans.html', 'src/assets/kalam-subscription-plans.jpg');

  await browser.close();
  console.log('\nDone! Both images saved to src/assets/');
})();
