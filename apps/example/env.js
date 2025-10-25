/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-env node */
/*
 * Env file to load and validate env variables
 * Be cautious; this file should not be imported into your source folder.
 * We split the env variables into two parts:
 * 1. Client variables: These variables are used in the client-side code (src folder).
 * 2. Build-time variables: These variables are used in the build process (app.config.ts file).
 * Import this file into the `app.config.ts` file to use environment variables during the build process. The client variables can then be passed to the client-side using the extra field in the `app.config.ts` file.
 * To access the client environment variables in your `src` folder, you can import them from `@env`. For example: `import Env from '@env'`.
 */
/**
 * 1st part: Import packages and Load your env variables
 * we use dotenv to load the correct variables from the .env file based on the APP_ENV variable (default is development)
 * APP_ENV is passed as an inline variable while executing the command, for example: APP_ENV=staging pnpm build:android
 */
const z = require('zod');
const path = require('path');
const packageJSON = require('./package.json');

const ClientEnvParams = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  NAME: z.string(),
  SLUG: z.string(),
  SCHEME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  //
  API_URL: z.string(),
});

const BuildTimeEnvParams = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
  // ADD YOUR BUILD TIME ENV VARS HERE
});

// Figure out which .env to load
const APP_ENV = process.env.APP_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${APP_ENV}`);

const remoteEnvPath =
  APP_ENV === 'development'
    ? process.env.DEVELOPMENT_ENV
    : APP_ENV === 'staging'
      ? process.env.STAGING_ENV
      : process.env.PRODUCTION_ENV;

require('dotenv').config({
  path: remoteEnvPath || envPath,
});

// TODO: Replace these values with your own

const BUNDLE_ID = 'com.isaacwes.expomonorepo'; // ios bundle id
const PACKAGE = 'com.isaacwes.expomonorepo'; // android package name
const NAME = 'T3t'; // app name
const SLUG = 'expo-monorepo'; // app slug
const EXPO_ACCOUNT_OWNER = 'isaacwes'; // expo account owner
const EAS_PROJECT_ID = '31d69750-f977-4186-b0b8-408d55ffce84'; // eas project id
const SCHEME = 'expo-monorepo'; // app scheme

/**
 * We declare a function withEnvSuffix that will add a suffix to the variable name based on the APP_ENV
 * Add a suffix to variable env based on APP_ENV
 * @param {string} name
 * @returns  {string}
 */

const withEnvSuffix = (name) => {
  return APP_ENV === 'production' ? name : `${name}.${APP_ENV}`;
};

/**
 * @type {Record<keyof z.infer<typeof ClientEnvParams> , unknown>}
 */
const clientEnv = {
  APP_ENV,
  NAME: NAME,
  SLUG: SLUG,
  SCHEME: SCHEME,
  BUNDLE_ID: withEnvSuffix(BUNDLE_ID),
  PACKAGE: withEnvSuffix(PACKAGE),
  VERSION: packageJSON.version,

  // ADD YOUR ENV VARS HERE TOO
  API_URL: process.env.API_URL,
};

/**
 * @type {Record<keyof z.infer<typeof BuildTimeEnvParams> , unknown>}
 */
const buildTimeEnv = {
  EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID,
  // ADD YOUR ENV VARS HERE TOO
};

const _env = {
  ...clientEnv,
  ...buildTimeEnv,
};
const merged = BuildTimeEnvParams.merge(ClientEnvParams);
const parsed = merged.safeParse(_env);

if (!parsed.success) {
  console.error(
    '❌ Invalid environment variables',
    parsed.error.format(),
    `\n❌ Missing variables in .env.${APP_ENV} file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`
  );
  throw new Error('Invalid environment variables, Check terminal for more details ');
}

const Env = parsed.data;
const ClientEnv = ClientEnvParams.parse(clientEnv);

module.exports = { Env, ClientEnv };
