import { createModuleReducer, on } from '@qvibi-toolbox/qapp';

import { PAGE1_MODULE_DEF } from '../def';
import { loadCatFactsBeganEvent, loadCatFactsDoneEvent, loadCatFactsFailedEvent } from './actions';

export const reducer = createModuleReducer(PAGE1_MODULE_DEF, { loading: false, facts: [] }, [
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
