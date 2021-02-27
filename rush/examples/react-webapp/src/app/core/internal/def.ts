import { defineModule, withState } from '@qvibi-toolbox/qapp';

import { IState } from './models';

export const CORE_MODULE_DEF = defineModule({ moduleName: 'core' }, withState<IState>());
