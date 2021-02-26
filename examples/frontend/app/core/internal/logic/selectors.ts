import { createModuleSelector, createSelector } from '@qvibi-toolbox/qapp';
import { CORE_MODULE_DEF } from '../def';

const getState = createModuleSelector(CORE_MODULE_DEF);

export const getIsAppReady = createSelector(getState, state => state.ready);
