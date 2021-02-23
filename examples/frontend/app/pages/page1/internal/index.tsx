import { createModule } from '@qvibi-toolbox/reduxify';
import { store } from 'examples/frontend/store';

import { page1ModuleDef } from './def';

import { Page1 } from './components';
import { reducer } from './store/reducer';
import { saga } from './store/sagas';

const page1Module = createModule(page1ModuleDef, { reducer: reducer, saga: saga });
store.addModule(page1Module);

export default Page1;
