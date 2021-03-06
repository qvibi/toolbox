import React from 'react';

import { Link } from 'react-router-dom';

import { generatePath } from '@qvibi-toolbox/qapp';
import { useSelector, useDispatch } from '@qvibi-toolbox/qapp-react';

import { getIsLoading, getFacts } from '../logic/selectors';
import { loadCatFactsAction } from '../logic/actions';
import { ROUTE_PAGE2 } from '../../../page2';

interface IProps {}

export const Page1 = React.memo<IProps>(props => {
    const dispatch = useDispatch();

    const loading = useSelector(getIsLoading);
    const facts = useSelector(getFacts);

    return (
        <div>
            <button onClick={() => dispatch(loadCatFactsAction({}))}>Load</button>
            <div>Page 1</div>
            <div>Facts:</div>
            {loading && <div>loading...</div>}
            {facts.map(f => {
                return (
                    <div key={f.id} style={{ padding: 20, backgroundColor: 'lightgray' }}>
                        {f.text}
                    </div>
                );
            })}
            <div>
                Navigate to <Link to={generatePath(ROUTE_PAGE2, {})}>Page 2</Link>
            </div>
        </div>
    );
});
