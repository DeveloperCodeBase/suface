module.exports = {
  root: true,
  env: { browser: true, es2022: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:tailwindcss/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  settings: {
    react: { version: 'detect' },
    tailwindcss: { callees: ['cn'] }
  },
  ignorePatterns: ['dist'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
  }
};
