import * as React from 'react';
import { Provider } from 'react-redux';

import { IQApp } from '@qvibi-toolbox/qapp';

export const withQApp = (qApp: IQApp, Element: React.ElementType) => ({ ...props }) => (
    <Provider store={qApp.getReduxStore()}>{<Element {...props} />}</Provider>
);
