import { test } from '../../src/fixtures/test';
import { assertHardeningHeaders } from '../../src/security/assertSafeApiResponse';

test('security 6 headers api health', { tag: ['@security', '@api'] }, async ({ api }) => {
  const response = await api.health();
  assertHardeningHeaders(response.headers());
});
