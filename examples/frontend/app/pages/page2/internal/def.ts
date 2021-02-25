import { defineModule, withState } from '@qvibi-toolbox/qapp';

import { IState } from './models';

export const page2Def = defineModule({ moduleName: 'page2' }, withState<IState>());
