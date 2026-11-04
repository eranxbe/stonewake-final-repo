AI tool: Cursor

Prompts used:
- remove credentials from tests:
`go over the project, wherever we use EMAIL, PASS, API KEY etc, make sure you read them from .env file`

- error reading from env file
`For the code present, we get this error:
```
Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
```
Fix it, verify, and then give a concise explanation. 
`

- wiring scripts/ directory
`
I added a @run-tests.js file, and added some scripts in playwright.config.ts, please adjust @run-tests.js so it fits the scripts and I can run the commands
`

- mark tests as suites
`
add this tagging convention to the existing tests (and their relevant suite respectively
tag: ['@api', '@regression']
`

- modular test infra
`
take a look at my test files. I want to expand the project and create a modular test-automation infra...
`


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
