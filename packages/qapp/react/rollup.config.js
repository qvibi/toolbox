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
    external: ['react', 'react-redux'],
    // plugins: [peerDepsExternal(), resolve(), commonjs(), typescript()],
    plugins: [typescript()],
};

export default config;
