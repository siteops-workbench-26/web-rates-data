// Parse only the publicly advertised MortgageWebCenter featured rates.
// This code runs without an account, cookies, credentials, or member data.
const RATE_PATTERN = /(?<!\d)(\d{1,2}(?:\.\d{1,3})?)\s*%/g;

function extractProduct(block, namePattern, productKey) {
  const match = namePattern.exec(block);
  if (!match) throw new Error('Required product not found: ' + productKey);
  const following = block.slice(match.index + match[0].length, match.index + match[0].length + 170);
  const nums = [...following.matchAll(RATE_PATTERN)];
  if (nums.length < 2) throw new Error('Rate and APR missing after ' + productKey);
  const heading = following.slice(0, nums[0].index);
  if (!/\brate\b/i.test(heading) || !/\bAPR\b/i.test(heading)) {
    throw new Error('Expected Rate and APR labels before values for ' + productKey);
  }
  const [rate, apr] = nums.slice(0, 2).map(m => Number(m[1]));
  if (![rate, apr].every(v => Number.isFinite(v) && v >= 0.5 && v <= 25)) {
    throw new Error('Rate or APR outside allowed range for ' + productKey);
  }
  return { rate_percent: rate, apr_percent: apr };
}

export function parseFeaturedRates(rawText) {
  const text = String(rawText || '').replace(/\u00a0/g, ' ').replace(/\r/g, '');
  const marker = /Today['\u2019]s\s+Featured\s+Rates/i.exec(text);
  if (!marker) throw new Error('Missing Today\'s Featured Rates heading');
  const featured = text.slice(marker.index + marker[0].length, marker.index + marker[0].length + 3200);
  return {
    fixed_30: extractProduct(featured, /30\s*[-\u2013\u2014]\s*Year\s+Fixed\s+Rate/i, '30-year fixed'),
    arm_1515: extractProduct(featured, /15\s*\/\s*15\s+Adjustable\s*[-\u2013\u2014]?\s*Rate/i, '15/15 ARM')
  };
}
