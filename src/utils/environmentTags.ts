import { Config } from '../generate/Config';

export const getEnvironmentTags = (config: Config): string => {
  const { typescript, reactNative, styling } = config;

  return Object.entries({
    TypeScript: typescript,
    'React Native': reactNative,
    [styling.toUpperCase()]: ['css', 'scss', 'jss'].includes(styling)
  })
    .filter(([, v]) => !!v)
    .map(([k]) => k)
    .join(', ');
};