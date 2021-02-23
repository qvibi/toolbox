import { createModule } from '@qvibi-toolbox/reduxify';
import { store } from '../../../core';

import { page1ModuleDef } from './def';
import { reducer } from './store/reducer';
import { saga } from './store/sagas';

const page1Module = createModule(page1ModuleDef, { reducer: reducer, saga: saga });

export function init() {
    store.addModule(page1Module);
}
