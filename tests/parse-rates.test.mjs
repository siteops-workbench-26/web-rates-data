import test from 'node:test';
import assert from 'node:assert/strict';
import { parseFeaturedRates } from '../scripts/parse-rates.mjs';

const sample = `Today's Featured Rates
30-Year Fixed Rate
Rate
APR
7.125%
7.298%
15-Year Fixed Rate
Rate
APR
6.625%
6.892%
15/15 Adjustable Rate
Rate
APR
6.125%
6.276%
MOREgage
Rate
APR
6.375%
6.576%`;

test('extracts the correct publicly featured rates and APRs', () => {
  assert.deepEqual(parseFeaturedRates(sample), {
    fixed_30: { rate_percent: 7.125, apr_percent: 7.298 },
    arm_1515: { rate_percent: 6.125, apr_percent: 6.276 }
  });
});

test('rejects a missing product or APR', () => {
  assert.throws(() => parseFeaturedRates('Today\'s Featured Rates\n30-Year Fixed Rate\nRate\nAPR\n7.125%\n7.298%'));
});

test('rejects an implausible APR', () => {
  assert.throws(() => parseFeaturedRates(sample.replace('6.276%', '78.000%')));
});
