import React from 'react';
import { Provider } from 'react-redux';

import { IQApp } from '@qvibi-toolbox/qapp';

export function withQApp(qApp: IQApp, node: React.ReactNode) {
    return <Provider store={qApp.getReduxStore()}>{node}</Provider>;
}
