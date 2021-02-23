import React from 'react';

import { useSelector, useDispatch } from '@qvibi-toolbox/reduxify';

import { getIsLoading, getFacts } from '../store/selectors';
import { loadCatFactsAction } from '../store/actions';

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
        </div>
    );
});
