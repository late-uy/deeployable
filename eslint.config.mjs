import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: ['node_modules', 'dist', 'coverage', 'api/prisma/migrations', 'api/prisma/var'],
  },
  prettier,
);
