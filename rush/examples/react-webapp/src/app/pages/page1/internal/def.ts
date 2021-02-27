import { defineModule, withState } from '@qvibi-toolbox/qapp';

import { IState } from './models';

export const PAGE1_MODULE_DEF = defineModule({ moduleName: 'page1' }, withState<IState>());
