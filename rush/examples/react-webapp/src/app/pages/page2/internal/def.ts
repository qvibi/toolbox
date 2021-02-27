import { defineModule, withState } from '@qvibi-toolbox/qapp';

import { IState } from './models';

export const PAGE2_MODULE_DEF = defineModule({ moduleName: 'page2' }, withState<IState>());
