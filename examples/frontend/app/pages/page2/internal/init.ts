import { createModule } from '@qvibi-toolbox/qapp';

import { exampleApp } from '../../../../app/core';

import { page2Def } from './def';

export function init() {
    exampleApp.addModule(createModule(page2Def, {}));
}
