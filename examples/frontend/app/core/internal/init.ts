import { createModule } from '@qvibi-toolbox/qapp';

import { QAPP } from './qapp';

import { CORE_MODULE_DEF } from './def';
import { reducer } from './logic/reducer';
import { saga } from './logic/sagas';

const CORE_MODULE = createModule(CORE_MODULE_DEF, { reducer: reducer, saga: saga });

QAPP.addModule(CORE_MODULE);
