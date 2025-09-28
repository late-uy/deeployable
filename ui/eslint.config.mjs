import nextConfig from 'eslint-config-next';
import base from '../eslint.config.mjs';
import tseslint from 'typescript-eslint';

export default tseslint.config(...base, ...nextConfig);
