import { readFileSync } from 'node:fs';
const data = JSON.parse(readFileSync('docs/rates.json', 'utf8'));
const expected = 'https://acuonline.mortgagewebcenter.com/responsive/#/ApplyNow';
if (data.schema_version !== 1 || data.status !== 'ok') throw new Error('Unexpected data schema/status');
if (data.source_url !== expected) throw new Error('Unexpected source URL');
const checked = Date.parse(data.checked_at);
const age = Date.now() - checked;
if (!Number.isFinite(age) || age < -600000 || age > 1800000) {
  throw new Error('Rate check not recent');
}
for (const name of ['arm_1515','fixed_30']) {
  const p = data.products?.[name];
  if (!p || ![p.rate_percent,p.apr_percent].every(n =>
    typeof n === 'number' && Number.isFinite(n) && n >= 0.5 && n <= 25)) {
    throw new Error('Missing or implausible rate/APR for ' + name);
  }
}
console.log('Validated published-data candidate as checked at ' + data.checked_at);
