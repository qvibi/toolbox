import { createSelector, getModuleTools } from '@qvibi-toolbox/qapp';

import { PAGE1_MODULE_DEF } from '../def';

const { getState } = getModuleTools(PAGE1_MODULE_DEF);

export const getIsLoading = createSelector(getState, state => state.loading);
export const getFacts = createSelector(getState, state => state.facts);
