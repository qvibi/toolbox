import React from 'react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { ReactComponent as NxLogo } from '../public/nx-logo-white.svg';
import './styles.css';

import { useDispatch, useSelector, withQApp } from '@qvibi-toolbox/qapp-react';

import { QAPP, initializeAppMsg, getIsAppReady } from '../app/core';

function CustomApp({ Component, pageProps }: AppProps) {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(initializeAppMsg({}));
    }, []);

    const ready = useSelector(getIsAppReady);

    return (
        <>
            <Head>
                <title>Welcome to frontend! {ready ? 'READY!!!' : 'not ready'}</title>
            </Head>
            <div className="app">
                <header className="flex">
                    <NxLogo width="75" height="50" />
                    <h1>Welcome to frontend! {ready ? 'READY!!!' : 'not ready'}</h1>
                </header>
                <main>
                    <Component {...pageProps} />
                </main>
            </div>
        </>
    );
}

export default withQApp(QAPP, CustomApp);
