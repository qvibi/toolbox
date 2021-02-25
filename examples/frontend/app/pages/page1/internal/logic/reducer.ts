import { createModuleReducer, on } from '@qvibi-toolbox/qapp';

import { page1ModuleDef } from '../def';
import { loadCatFactsBeganEvent, loadCatFactsDoneEvent, loadCatFactsFailedEvent } from './actions';

export const reducer = createModuleReducer(page1ModuleDef, { loading: false, facts: [] }, [
    on(loadCatFactsBeganEvent, state => {
        return {
            ...state,
            loading: true,
        };
    }),
    on(loadCatFactsDoneEvent, (state, { facts }) => {
        return {
            ...state,
            loading: false,
            facts: facts,
        };
    }),
    on(loadCatFactsFailedEvent, state => {
        return {
            ...state,
            loading: false,
            facts: [],
        };
    }),
]);
