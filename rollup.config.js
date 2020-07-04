import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import pkg from './package.json'

export default {
  input: 'src/TEIRouter.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false
    }
  ],
  external: ['react'],
  plugins: [
    resolve(),
    babel({
        plugins: [
          '@babel/plugin-proposal-class-properties'
        ],
        exclude: 'node_modules/**',
        presets: ['@babel/env', '@babel/preset-react']
    }),
    commonjs()
  ]
}
