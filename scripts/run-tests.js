require('dotenv').config();

const { spawn } = require('child_process');
const { loadRunConfig, getSuiteGrep, getProjectNames } = require('./load-config');

function parseArgs(argv) {
  const result = {
    extra: [],
    headed: false,
    debug: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') {
      result.extra.push(...argv.slice(i + 1));
      break;
    }
    if (arg === '--env') {
      result.env = argv[i + 1];
      i += 1;
    } else if (arg === '--suite') {
      result.suite = argv[i + 1];
      i += 1;
    } else if (arg === '--type') {
      result.type = argv[i + 1];
      i += 1;
    } else if (arg === '--headed') {
      result.headed = true;
    } else if (arg === '--debug') {
      result.debug = true;
    } else {
      result.extra.push(arg);
    }
  }

  return result;
}

function usageAndExit(message) {
  console.error(message);
  console.error(
    [
      '',
      'Usage: node scripts/run-tests.js [options] [-- playwright-args...]',
      '',
      'Options:',
      '  --env <local|ci>       Environment overlay (default: local)',
      '  --suite <name>         Suite from config/suites.yaml (default: all)',
      '  --type <ui|api|security|all>    Project filter (default: all)',
      '  --headed               Run browsers headed',
      '  --debug                Open Playwright Inspector',
      '',
      'npm scripts:',
      '  npm test',
      '  npm run test:ui',
      '  npm run test:api',
      '  npm run test:security',
      '  npm run test:smoke',
      '  npm run test:regression',
      '  npm run test:ui:smoke',
      '  npm run test:api:smoke',
      '  npm run test:headed',
      '  npm run test:debug',
      '  npm run test:ui:headed',
      '  npm run test:ci',
    ].join('\n'),
  );
  process.exit(1);
}

let args;
let config;
let grep;
let projects;

try {
  args = parseArgs(process.argv.slice(2));
  config = loadRunConfig({
    env: args.env,
    suite: args.suite,
    type: args.type,
    headed: args.headed || args.debug ? true : undefined,
  });
  grep = getSuiteGrep(config.suite);
  projects = getProjectNames(config, config.type);
} catch (err) {
  usageAndExit(err instanceof Error ? err.message : String(err));
}

const playwrightCli = require.resolve('@playwright/test/cli');
const pwArgs = ['test'];
for (const project of projects) {
  pwArgs.push('--project', project);
}
if (grep) {
  pwArgs.push('--grep', grep);
}
if (args.headed || config.headed) {
  pwArgs.push('--headed');
}
if (args.debug) {
  pwArgs.push('--debug');
}
pwArgs.push(...args.extra);

console.log(
  `[run-tests] env=${config.env} suite=${config.suite} type=${config.type} projects=${projects.join(',')} grep=${grep || '(all)'}`,
);

const child = spawn(process.execPath, [playwrightCli, ...pwArgs], {
  stdio: 'inherit',
  env: {
    ...process.env,
    TEST_CONFIG_JSON: JSON.stringify(config),
    TEST_ENV: config.env,
    TEST_SUITE: config.suite,
    TEST_TYPE: config.type,
    TEST_HEADED: config.headed ? '1' : '0',
  },
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});
