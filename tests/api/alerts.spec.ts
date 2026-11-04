import { test, expect } from '../../src/fixtures/test';
import { alertChannels, alertSeverities } from '../../src/constants/data';
import { apiErrors } from '../../src/constants/messages';

test('api 17 alert events and channels', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const eventsResponse = await api.alertEvents({ limit: 5 });
  expect(eventsResponse.status()).toBe(200);

  const eventsJson = await eventsResponse.json();
  expect(Array.isArray(eventsJson.items)).toBe(true);
  expect(eventsJson.items.length).toBeGreaterThanOrEqual(1);
  expect(eventsJson.items.length).toBeLessThanOrEqual(5);

  for (const event of eventsJson.items) {
    expect(typeof event.id).toBe('number');
    expect(typeof event.event_class).toBe('string');
    expect(alertSeverities).toContain(event.severity);
    expect(typeof event.occurred_at).toBe('string');
    expect(typeof event.created_at).toBe('string');
  }

  const filteredResponse = await api.alertEvents({ limit: 3, severity: 'info' });
  expect(filteredResponse.status()).toBe(200);
  for (const event of (await filteredResponse.json()).items) {
    expect(event.severity).toBe('info');
  }

  const channelsResponse = await api.alertChannels();
  expect(channelsResponse.status()).toBe(200);

  const channelsJson = await channelsResponse.json();
  expect(Array.isArray(channelsJson.channels)).toBe(true);
  expect(channelsJson.channels.length).toBeGreaterThanOrEqual(1);

  for (const channel of channelsJson.channels) {
    expect(alertChannels).toContain(channel.channel);
    expect(typeof channel.delivers).toBe('boolean');
  }

  expect((await api.alertEvents(undefined, 'none')).status()).toBe(401);
  expect(await (await api.alertChannels('none')).json()).toEqual(apiErrors.unauthenticated);
});
