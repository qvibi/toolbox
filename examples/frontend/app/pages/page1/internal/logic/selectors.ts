import { createModuleSelector, createSelector } from '@qvibi-toolbox/qapp';

import { page1ModuleDef } from '../def';

const getState = createModuleSelector(page1ModuleDef);

export const getIsLoading = createSelector(getState, state => state.loading);
export const getFacts = createSelector(getState, state => state.facts);
