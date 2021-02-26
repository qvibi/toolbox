import { createModuleReducer, on } from '@qvibi-toolbox/qapp';

import { CORE_MODULE_DEF } from '../def';
import { appReadyMsg } from './messages';

export const reducer = createModuleReducer(CORE_MODULE_DEF, { ready: false }, [on(appReadyMsg, state => ({ ...state, ready: true }))]);
