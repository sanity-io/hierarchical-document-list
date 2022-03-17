module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'sanity/typescript'
  ],
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['*.cjs'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2019
  },
  env: {
    browser: true,
    es2017: true,
    node: true
  },
  rules: {
    'max-len': [0],
    'implicit-arrow-linebreak': [0],
    indent: [0],
    'array-bracket-newline': [0],
    'function-paren-newline': [0],
    '@typescript-eslint/no-explicit-any': [0]
  }
}
