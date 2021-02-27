import { createModule } from '@qvibi-toolbox/qapp';

import { QAPP } from '../../../../app/core';

import { PAGE2_MODULE_DEF } from './def';

QAPP.addModule(createModule(PAGE2_MODULE_DEF, {}));
