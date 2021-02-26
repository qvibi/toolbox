import { getModuleTools, on } from '@qvibi-toolbox/qapp';

import { PAGE1_MODULE_DEF } from '../def';
import { loadCatFactsBeganEvent, loadCatFactsDoneEvent, loadCatFactsFailedEvent } from './actions';

const { createReducer } = getModuleTools(PAGE1_MODULE_DEF);

export const reducer = createReducer({ loading: false, facts: [] }, [
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
