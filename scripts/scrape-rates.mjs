import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { parseFeaturedRates } from './parse-rates.mjs';

const SOURCE = 'https://acuonline.mortgagewebcenter.com/responsive/#/ApplyNow';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1100 },
  locale: 'en-US',
  timezoneId: 'America/New_York'
});

try {
  await page.goto(SOURCE, { waitUntil: 'domcontentloaded', timeout: 45000 });
  let result = null;
  let lastError = null;
  // The public application may render asynchronously or in subframes.
  for (let attempt = 0; attempt < 24; attempt++) {
    for (const frame of page.frames()) {
      try {
        const visibleText = await frame.locator('body').innerText({ timeout: 2500 });
        result = parseFeaturedRates(visibleText);
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (result) break;
    await page.waitForTimeout(1250);
  }
  if (!result) throw new Error('Required public rate fields were not found: ' + String(lastError));
  const data = {
    schema_version: 1,
    status: 'ok',
    source_url: SOURCE,
    checked_at: new Date().toISOString(),
    products: result
  };
  await mkdir('docs', { recursive: true });
  await writeFile('docs/rates.json', JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log('Public featured rates checked: 15/15 ' + result.arm_1515.rate_percent +
    '% (APR ' + result.arm_1515.apr_percent + '%); 30-year fixed ' +
    result.fixed_30.rate_percent + '% (APR ' + result.fixed_30.apr_percent + '%).');
} catch (error) {
  console.error('No public rates produced. Last valid published data will be unchanged.', error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
