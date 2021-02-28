import { getModuleTools } from '@qvibi-toolbox/qapp';
import { CORE_MODULE_DEF } from '../def';

const { createJobGroup } = getModuleTools(CORE_MODULE_DEF);

export const initializationJobGroup = createJobGroup({ jobGroupName: 'initialization' });
