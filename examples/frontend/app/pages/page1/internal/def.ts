import { defineModule, withState } from '@qvibi-toolbox/reduxify';

import { ICatFact } from './models/cat-fact';

export const page1ModuleDef = defineModule({ moduleName: 'page1' }, withState<{ loading: boolean; facts: ICatFact[] }>());
