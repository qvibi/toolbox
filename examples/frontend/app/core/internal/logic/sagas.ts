import { getModuleTools, put, runJobGroup, takeEvery } from '@qvibi-toolbox/qapp';

import { CORE_MODULE_DEF } from '../def';
import { initializationJobGroup } from './jobs';
import { appReadyMsg, initializeAppMsg } from './messages';

const { createSaga, createMsgSaga } = getModuleTools(CORE_MODULE_DEF);

const onInitializeApp = createMsgSaga(initializeAppMsg, function* () {
    yield runJobGroup(initializationJobGroup);

    yield put(appReadyMsg({}));
});

export const saga = createSaga(function* () {
    yield takeEvery(initializeAppMsg, onInitializeApp);
});
