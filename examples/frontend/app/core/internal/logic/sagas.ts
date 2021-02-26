import { createModuleSaga, createMsgSaga, put, runJobGroup, takeEvery } from '@qvibi-toolbox/qapp';

import { CORE_MODULE_DEF } from '../def';
import { initializationJobGroup } from './jobs';
import { appReadyMsg, initializeAppMsg } from './messages';

const onInitializeApp = createMsgSaga(initializeAppMsg, function* () {
    yield runJobGroup(initializationJobGroup);

    yield put(appReadyMsg({}));
});

export const saga = createModuleSaga(CORE_MODULE_DEF, function* () {
    yield takeEvery(initializeAppMsg, onInitializeApp);
});
