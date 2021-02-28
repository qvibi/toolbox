import { createQApp, defineModule, withState, createModule, createSelector, withPayload, on, put, takeEvery, getModuleTools } from './index';

describe('reduxify', () => {
    it('should work', async () => {
        const module1Def = defineModule({ moduleName: 'module1' }, withState<{ message: string }>());

        const { defineMsg, createReducer, createSaga, createMsgSaga, getState } = getModuleTools(module1Def);

        const modifyMessageAction = defineMsg('modify_message', withPayload());
        const messageChangedEvent = defineMsg('message_changed', withPayload<{ newMessage: string }>());

        const reducer1 = createReducer({ message: 'hello' }, [
            on(messageChangedEvent, (state, payload) => {
                return {
                    ...state,
                    message: payload.newMessage,
                };
            }),
        ]);

        const saga1 = createSaga(function* () {
            const onModifyMsg = createMsgSaga(modifyMessageAction, function* () {
                yield put(messageChangedEvent({ newMessage: 'world!' }));
            });

            yield takeEvery(modifyMessageAction, onModifyMsg);
        });

        const getMessage = createSelector(getState, state => state.message);

        const module1 = createModule(module1Def, { reducer: reducer1, saga: saga1 });
        const store = createQApp({
            modules: [module1],
        });

        let state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('hello');

        // start app

        const rootDef = defineModule({ moduleName: 'root' }, withState());
        const rootTools = getModuleTools(rootDef);
        const root = createModule(rootDef, {
            saga: rootTools.createSaga(function* () {
                yield put(modifyMessageAction({}));
            }),
        });
        store.addModule(root);

        await new Promise(resolve => setTimeout(resolve, 100));
        await store.complete();

        state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('world!');
    });
});
