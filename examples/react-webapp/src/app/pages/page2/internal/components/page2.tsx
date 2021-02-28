import React from 'react';

import { Link } from 'react-router-dom';

import { generatePath } from '@qvibi-toolbox/qapp';

import { ROUTE_PAGE1 } from '../../../page1';

export const Page2 = React.memo(() => {
    return (
        <div>
            Page 2
            <div>
                Navigate to <Link to={generatePath(ROUTE_PAGE1, {})}>Page 1</Link>
            </div>
        </div>
    );
});
