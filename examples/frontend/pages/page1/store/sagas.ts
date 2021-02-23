import { call, createModuleSaga, createMsgSaga, ExtractResult, put, takeEvery } from '@qvibi-toolbox/reduxify';

import { page1ModuleDef } from '../def';
import { mapCatFactFromDto } from '../models/mappers';
import { getCatFacts } from '../services/cat-facts.service';
import { loadCatFactsAction, loadCatFactsBeganEvent, loadCatFactsDoneEvent, loadCatFactsFailedEvent } from './actions';

const onLoadCatFacts = createMsgSaga(loadCatFactsAction, function* (msg) {
    try {
        yield put(loadCatFactsBeganEvent({}));

        const factsDto: ExtractResult<typeof getCatFacts> = yield call(getCatFacts);

        yield put(loadCatFactsDoneEvent({ facts: factsDto.map(mapCatFactFromDto) }));
    } catch {
        yield put(loadCatFactsFailedEvent({}));
    }
});

export const saga = createModuleSaga(page1ModuleDef, function* () {
    yield takeEvery(loadCatFactsAction, onLoadCatFacts);
});
