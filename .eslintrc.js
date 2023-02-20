module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    uni: true,
    getCurrentPages: true,
  },
  // add your custom rules here
  // it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 2, maxBOF: 2 }],
    'accessor-pairs': 2,
    'arrow-spacing': [
      2,
      {
        before: true,
        after: true,
      },
    ],
    'block-spacing': [2, 'always'],
    'handle-callback-err': 0,
    'no-useless-escape': 0,
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    'semi-spacing': [
      2,
      {
        before: false,
        after: true,
      },
    ],
    'space-before-function-paren': 0,
    'space-in-parens': [2, 'never'],
    'space-infix-ops': 2,
    'space-unary-ops': [
      2,
      {
        words: true,
        nonwords: false,
      },
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: [
          'global',
          'globals',
          'eslint',
          'eslint-disable',
          '*package',
          '!',
          ',',
        ],
      },
    ],
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2,
    'valid-typeof': 2,
    'wrap-iife': [2, 'any'],
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'],
    'prefer-const': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'object-curly-spacing': [
      2,
      'always',
      {
        objectsInObjects: false,
      },
    ],
    'array-bracket-spacing': [2, 'never'],
    'no-case-declarations': 0,
    'no-prototype-builtins': 0,
    'no-async-promise-executor': 0,
    'no-unused-vars': 0,
    'no-dupe-else-if': 0,
    'max-len': [0, 80, 4], // 字符串最大长度
    'key-spacing': [
      2,
      {
        beforeColon: false,
        afterColon: true,
      },
    ],
  },
}
