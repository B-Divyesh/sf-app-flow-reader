import assert from 'node:assert/strict';

const productApi = process.env.LIVE_PRODUCT_API_BASE ?? 'https://api.sociobot.in/api/v1';
const slug = 'app-flow-reader';
const checkoutUrl = `${productApi}/products/${slug}/checkout`;
const timeout = () => AbortSignal.timeout(20_000);
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function startCheckout() {
  let response;
  for (let attempt = 0; attempt < 4; attempt += 1) {
    response = await fetch(checkoutUrl, { redirect: 'manual', signal: timeout() });
    if (response.status !== 429 && response.status < 500) return response;
    await response.arrayBuffer();
    await wait(500 * (2 ** attempt));
  }
  return response;
}

const catalogResponse = await fetch(`${productApi}/products`, { signal: timeout() });
assert.equal(catalogResponse.status, 200, 'The live product catalog must be available');

const catalog = await catalogResponse.json();
const product = catalog.data?.find((entry) => entry.slug === slug);
assert.ok(product, `${slug} must be enabled in the live product catalog`);
assert.deepEqual(
  product,
  {
    checkout_url: checkoutUrl,
    currency: 'USD',
    name: 'App Flow Reader Supporter',
    price_minor: 1200,
    product_url: 'https://app-flow-reader.sociobot.in/',
    slug,
  },
  'The live billing record must match the advertised supporter license',
);

const checkoutResponse = await startCheckout();
assert.equal(checkoutResponse.status, 303, 'Checkout must redirect to the hosted payment page');

const location = checkoutResponse.headers.get('location');
assert.ok(location, 'Checkout must return a redirect location');
const hostedCheckout = new URL(location);
assert.equal(hostedCheckout.origin, 'https://checkout.dodopayments.com');
assert.match(hostedCheckout.pathname, /^\/session\/cks_[A-Za-z0-9]+$/);

const hostedResponse = await fetch(location, { signal: timeout() });
assert.equal(hostedResponse.status, 200, 'The hosted checkout page must load');

console.log(`Live checkout passed: ${checkoutUrl} -> ${hostedCheckout.origin}${hostedCheckout.pathname}`);
