module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
      extends: ['standard', 'plugin:prettier/recommended', 'prettier/standard']
    },
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: {
        // @typescript-eslint/parser使用
        project: './tsconfig.json'
      },
      extends: [
        /**
         * standard-with-typescript中默认开启了eslint-config-standard
         * 同时会对*.ts *.tsx文件进行ts特有的校验，但不会对vue进行ts校验
         */
        'standard-with-typescript',
        'plugin:prettier/recommended',
        'prettier/standard',
        'prettier/@typescript-eslint'
      ]
    }
  ]
}
