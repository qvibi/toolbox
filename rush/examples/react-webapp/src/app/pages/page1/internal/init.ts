import { createModule } from '@qvibi-toolbox/qapp';

import { QAPP } from '../../../core';

import { PAGE1_MODULE_DEF } from './def';
import { reducer } from './logic/reducer';
import { saga } from './logic/sagas';

QAPP.addModule(createModule(PAGE1_MODULE_DEF, { reducer: reducer, saga: saga }));
