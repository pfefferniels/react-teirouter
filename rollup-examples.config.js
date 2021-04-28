import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import copy from 'rollup-plugin-copy'

export default {
  input: 'examples/ceteicean.js',
  output: [
    {
      file: 'dist/public/ceteicean.js',
      format: 'umd',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  plugins: [
    resolve(),
    replace({
      'process.env.NODE_ENV': JSON.stringify( 'production' )
    }),
    babel({
        babelHelpers: 'runtime',
        plugins: [
          '@babel/plugin-proposal-class-properties',
          ["@babel/plugin-transform-runtime", {
            regenerator: true
          }]
        ],
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react']
    }),
    commonjs(),
    copy({
      targets: [
        { src: 'examples/index.html', dest: 'dist/public' }
      ]
    }),
  ]
}
