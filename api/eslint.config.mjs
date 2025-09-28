import base from '../eslint.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...base, {
  files: ['src/**/*.ts'],
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json',
    },
  },
});
