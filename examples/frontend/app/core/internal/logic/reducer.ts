import { getModuleTools, on } from '@qvibi-toolbox/qapp';

import { CORE_MODULE_DEF } from '../def';
import { appReadyMsg } from './messages';

const { createReducer } = getModuleTools(CORE_MODULE_DEF);

export const reducer = createReducer({ ready: false }, [on(appReadyMsg, state => ({ ...state, ready: true }))]);
