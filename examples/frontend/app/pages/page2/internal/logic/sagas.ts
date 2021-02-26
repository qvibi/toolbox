import { createJobs, createModuleSaga, delay } from '@qvibi-toolbox/qapp';

import { initializationJobGroup } from 'examples/frontend/app/core';

import { PAGE2_MODULE_DEF } from '../def';

const createJob = createJobs(PAGE2_MODULE_DEF);

const doInitialize = createJob(initializationJobGroup, 'initialize', function* () {
    yield delay(1000);
});

export const saga = createModuleSaga(PAGE2_MODULE_DEF, function* () {
    initializationJobGroup.addJob(doInitialize);
});
