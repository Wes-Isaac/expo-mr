import type { ConfigContext, ExpoConfig } from 'expo/config';
import { Env, ClientEnv } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  slug: Env.SLUG,
  version: Env.VERSION.toString(),
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,

  orientation: 'portrait',
  icon: './assets/icon-light.png',
  userInterfaceStyle: 'automatic',
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: Env.BUNDLE_ID,
    supportsTablet: true,
    icon: {
      light: './assets/icon-light.png',
      dark: './assets/icon-dark.png',
    },
  },
  android: {
    package: Env.PACKAGE,
    adaptiveIcon: {
      foregroundImage: './assets/icon-light.png',
      backgroundColor: '#1F104A',
    },
    edgeToEdgeEnabled: true,
  },
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
    reactCanary: true,
    reactCompiler: true,
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
    ],
    'expo-font',
    'expo-web-browser',
  ],
});
