import { defineModule, withState } from '@qvibi-toolbox/qapp';

import { IState } from './models';

export const page1ModuleDef = defineModule({ moduleName: 'page1' }, withState<IState>());
