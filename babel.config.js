const presets = [
  [
    '@babel/env',
    {
      debug: true,
      modules: process.env.NODE_ENV === 'cjs' ? 'auto' : false
    }
  ],
  '@babel/typescript'
]
const plugins = [
  '@babel/plugin-proposal-class-properties',
  ['@babel/plugin-transform-runtime'],
  [
    'babel-plugin-import',
    {
      libraryName: 'lodash',
      libraryDirectory: '',
      camel2DashComponentName: false
    }
  ]
]

module.exports = {
  presets,
  plugins
}
