import typescript from '@rollup/plugin-typescript';

const config = {
    input: './src/index.ts',
    output: [
        {
            dir: './dist',
            format: 'esm',
            sourcemap: true,
        },
    ],
    external: ['redux', 'redux-saga', 'redux-saga/effects', 'reselect', 'react-router'],
    // plugins: [peerDepsExternal(), resolve(), commonjs(), typescript()],
    plugins: [typescript()],
};

export default config;
