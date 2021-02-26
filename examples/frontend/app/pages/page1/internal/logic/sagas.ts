import { call, createModuleSaga, createMsgSaga, QAppExtractResult, put, takeEvery, delay, createJobs } from '@qvibi-toolbox/qapp';
import { initializationJobGroup } from 'examples/frontend/app/core';

import { PAGE1_MODULE_DEF } from '../def';
import { mapCatFactFromDto } from '../models/mappers';
import { getCatFacts } from '../services/cat-facts.service';
import { loadCatFactsAction, loadCatFactsBeganEvent, loadCatFactsDoneEvent, loadCatFactsFailedEvent } from './actions';

const createJob = createJobs(PAGE1_MODULE_DEF);

const onLoadCatFacts = createMsgSaga(loadCatFactsAction, function* (msg) {
    try {
        yield put(loadCatFactsBeganEvent({}));

        const factsDto: QAppExtractResult<typeof getCatFacts> = yield call(getCatFacts);

        yield put(loadCatFactsDoneEvent({ facts: factsDto.map(mapCatFactFromDto) }));
    } catch {
        yield put(loadCatFactsFailedEvent({}));
    }
});

const doInitialize = createJob(initializationJobGroup, 'initialize', function* () {
    yield delay(1000);
});

export const saga = createModuleSaga(PAGE1_MODULE_DEF, function* () {
    initializationJobGroup.addJob(doInitialize);

    yield takeEvery(loadCatFactsAction, onLoadCatFacts);
});
