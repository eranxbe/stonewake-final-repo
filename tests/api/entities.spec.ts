import { test, expect } from '../../src/fixtures/test';
import { apiErrors } from '../../src/constants/messages';

test('api 7 entities', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const entitiesListResponse = await api.entities({ limit: 2 });
  expect(entitiesListResponse.status()).toBe(200);

  const entitiesListJson = await entitiesListResponse.json();
  expect(Array.isArray(entitiesListJson.items)).toBe(true);
  expect(entitiesListJson.items.length).toBeGreaterThanOrEqual(1);
  expect(entitiesListJson.limit).toBe(2);
  expect(entitiesListJson.total).toBeGreaterThan(0);

  for (const entity of entitiesListJson.items) {
    expect(typeof entity.id).toBe('number');
    expect(typeof entity.slug).toBe('string');
    expect(typeof entity.display_name).toBe('string');
    expect(typeof entity.kind).toBe('string');
  }

  const firstEntity = entitiesListJson.items[0];
  const entityByIdResponse = await api.entity(firstEntity.id);
  expect(entityByIdResponse.status()).toBe(200);
  expect(await entityByIdResponse.json()).toEqual(firstEntity);
});

test('api 8 entity not found', { tag: ['@api', '@regression'] }, async ({ api }) => {
  const missingEntityResponse = await api.entity(999999);
  expect(missingEntityResponse.status()).toBe(404);
  expect(await missingEntityResponse.json()).toEqual(apiErrors.notFound);

  const invalidEntityIdResponse = await api.entity('abc');
  expect(invalidEntityIdResponse.status()).toBe(422);
  const validationErrorJson = await invalidEntityIdResponse.json();
  expect(validationErrorJson.error.code).toBe('validation_failed');
  expect(validationErrorJson.detail[0].type).toBe('int_parsing');
  expect(validationErrorJson.detail[0].loc).toEqual(['path', 'entity_id']);

  expect((await api.node(999999999)).status()).toBe(404);
  expect((await api.entity(999999, 'none')).status()).toBe(401);
});
