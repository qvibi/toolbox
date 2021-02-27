import { getModuleTools, withPayload } from '@qvibi-toolbox/qapp';
import { CORE_MODULE_DEF } from '../def';

const { defineMsg } = getModuleTools(CORE_MODULE_DEF);

export const initializeAppMsg = defineMsg('initialize_app', withPayload());
export const appReadyMsg = defineMsg('app_ready', withPayload());
