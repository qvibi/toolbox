import { createModule } from '@qvibi-toolbox/qapp';

import { exampleApp } from '../../../core';

import { page1ModuleDef } from './def';
import { reducer } from './logic/reducer';
import { saga } from './logic/sagas';

export function init() {
    exampleApp.addModule(createModule(page1ModuleDef, { reducer: reducer, saga: saga }));
}
