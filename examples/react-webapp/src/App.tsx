import React from 'react';
import './App.css';

import { BrowserRouter, Route, Link } from 'react-router-dom';

import { useDispatch, useSelector, withQApp } from '@qvibi-toolbox/qapp-react';

import { getIsAppReady, initializeAppMsg, QAPP } from './app/core';
import { Page1, ROUTE_PAGE1 } from './app/pages/page1';
import { Page2, ROUTE_PAGE2 } from './app/pages/page2';
import { generatePath } from '@qvibi-toolbox/qapp';

function App() {
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(initializeAppMsg({}));
    }, [dispatch]);

    const ready = useSelector(getIsAppReady);

    return (
        <div>
            <h1>Welcome to qapp example! {ready ? 'READY!!!' : 'not ready'}</h1>
            <main>
                <BrowserRouter>
                    <Route path={ROUTE_PAGE1.path} component={Page1} />
                    <Route path={ROUTE_PAGE2.path} component={Page2} />
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <div>
                                <Link to={generatePath(ROUTE_PAGE1, {})}>Go to Page1</Link>
                            </div>
                        )}
                    />
                </BrowserRouter>
            </main>
        </div>
    );
}

export default withQApp(QAPP, App);
