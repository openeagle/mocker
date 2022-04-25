const path = require('path')

module.exports = {
  root: true,
  extends: ['@openeagle/eslint-config-vue/typescript'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'import/export': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', path.resolve(__dirname, './src')]],
      },
    },
  },
}
