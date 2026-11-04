# Stonewake Playwright tests

Prompts used while building this project: [USED_PROMPTS.md](USED_PROMPTS.md)

## Layout

```
src/
  constants/   env, routes, messages, test data, security payloads
  clients/     ApiClient
  pages/       page objects
  fixtures/    Playwright test.extend
  security/    shared security assertions
tests/
  ui/          domain UI specs
  api/         domain API specs
  security/    opt-in security suite (SQLi, XSS, CSRF, headers, authz)
```

Import `{ test, expect }` from `src/fixtures/test` in new specs. Tag with `@ui`/`@api` plus `@smoke`/`@regression`.

## Account requirements

`STONEWAKE_EMAIL` / `STONEWAKE_PASSWORD` should be an **analyst with Deal Book** (tender dismiss / add-to-deal-book) and an **admin** (Settings API keys + audit log CSV). The API key in `.env` must be allowed to download reports and packs.

## Security suite

Black-box probes for SQL injection, XSS, CSRF/session hardening, security headers, and malformed auth. Tagged `@security`.

```bash
npm run test:security
```

Security projects are **not** included in `npm test`, `npm run test:ci`, smoke, or regression (`--type all` stays UI + API only).
