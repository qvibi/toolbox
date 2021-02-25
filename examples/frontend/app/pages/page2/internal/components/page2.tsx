import React from 'react';

import Link from 'next/link';

import { generatePath } from '@qvibi-toolbox/qapp';

import { page1RouteDef } from '../../../page1';

export const Page2 = React.memo(() => {
    return (
        <div>
            Page 2
            <div>
                Navigate to <Link href={generatePath(page1RouteDef, {})}>Page 1</Link>
            </div>
        </div>
    );
});
