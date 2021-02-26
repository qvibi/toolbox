import { createJob, createJobGroup } from '@qvibi-toolbox/qapp';
import { CORE_MODULE_DEF } from '../def';

export const initializationJobGroup = createJobGroup(CORE_MODULE_DEF, { jobGroupName: 'initialization' });
