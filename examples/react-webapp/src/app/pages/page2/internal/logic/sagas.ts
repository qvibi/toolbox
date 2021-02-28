import { delay, getModuleTools } from '@qvibi-toolbox/qapp';

import { initializationJobGroup } from '../../../../core';

import { PAGE2_MODULE_DEF } from '../def';

const { createJob, createSaga } = getModuleTools(PAGE2_MODULE_DEF);

const doInitialize = createJob(initializationJobGroup, 'initialize', function* () {
    yield delay(1000);
});

export const saga = createSaga(function* () {
    initializationJobGroup.addJob(doInitialize);
});
