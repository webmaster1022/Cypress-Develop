import ts from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import replace from '@rollup/plugin-replace'

import pkg from './package.json'

const banner = `
/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} Cypress.io
 * Released under the MIT License
 */
`

function createEntry (options) {
  const {
    format,
    input,
    isBrowser,
  } = options

  const config = {
    input,
    external: [
      'vue',
    ],
    plugins: [
      resolve({ preferBuiltins: true }),
      commonjs(),
      json(),
      /**
       * Vue 2 core tries to load require.resolve(`./package.json`) in the browser for the
       * sole purpose of throwing an error about Vue Loader.
       * Just truncate this for now for simplicity.
       */
      replace({
        'vueVersion && vueVersion !== packageVersion': JSON.stringify(false),
      }),
    ],
    output: {
      banner,
      name: 'CypressVue2',
      file: pkg.unpkg,
      format,
      globals: {
        vue: 'Vue',
      },
      exports: 'auto',
    },
  }

  if (input === 'src/index.ts') {
    if (format === 'es') {
      config.output.file = pkg.module
      if (isBrowser) {
        config.output.file = pkg.unpkg
      }
    }

    if (format === 'cjs') {
      config.output.file = pkg.main
    }
  } else {
    config.output.file = input.replace(/^src\//, 'dist/')
  }

  console.log(`Building ${format}: ${config.output.file}`)

  config.plugins.push(
    ts({
      check: format === 'es' && isBrowser,
      tsconfigOverride: {
        compilerOptions: {
          declaration: format === 'es',
          target: 'es5', // not sure what this should be?
          module: format === 'cjs' ? 'es2015' : 'esnext',
        },
        exclude: ['tests'],
      },
    }),
  )

  return config
}

export default [
  createEntry({ format: 'es', input: 'src/index.ts', isBrowser: false }),
  createEntry({ format: 'es', input: 'src/index.ts', isBrowser: true }),
  createEntry({ format: 'iife', input: 'src/index.ts', isBrowser: true }),
  createEntry({ format: 'cjs', input: 'src/index.ts', isBrowser: false }),
]
