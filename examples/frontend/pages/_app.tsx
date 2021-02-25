import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg';
import './styles.css';

import { withQApp } from '@qvibi-toolbox/qapp-react';
import { exampleApp } from '../app/core';

function CustomApp({ Component, pageProps }: AppProps) {
    return withQApp(
        exampleApp,
        <>
            <Head>
                <title>Welcome to frontend!</title>
            </Head>
            <div className="app">
                <header className="flex">
                    <NxLogo width="75" height="50" />
                    <h1>Welcome to frontend!</h1>
                </header>
                <main>
                    <Component {...pageProps} />
                </main>
            </div>
        </>,
    );
}

export default CustomApp;
