# Stonewake Playwright tests

Prompts used while building this project: [USED_PROMPTS.md](USED_PROMPTS.md)

## Layout

```
src/
  constants/   env, routes, messages, test data
  clients/     ApiClient
  pages/       page objects
  fixtures/    Playwright test.extend
tests/
  ui/          domain UI specs
  api/         domain API specs
```

Import `{ test, expect }` from `src/fixtures/test` in new specs. Tag with `@ui`/`@api` plus `@smoke`/`@regression`.
