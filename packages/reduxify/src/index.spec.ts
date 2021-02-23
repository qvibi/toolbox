import {
    defineModule,
    withState,
    createReducer,
    createStore,
    createModuleSelector,
    createSelector,
    defineMsgs,
    withPayload,
    on,
    createModuleSaga,
    createMsgSaga,
    put,
    takeEvery,
} from './index';
import { createModule } from './lib/module';

describe('reduxify', () => {
    it('should work', async () => {
        const module1Def = defineModule({ moduleName: 'module1' }, withState<{ message: string }>());

        const defineMsg = defineMsgs(module1Def);
        const modifyMessageAction = defineMsg('modify_message', withPayload());
        const messageChangedEvent = defineMsg('message_changed', withPayload<{ newMessage: string }>());

        const reducer1 = createReducer(module1Def, { message: 'hello' }, [
            on(messageChangedEvent, (state, payload) => {
                return {
                    ...state,
                    message: payload.newMessage,
                };
            }),
        ]);

        const saga1 = createModuleSaga(module1Def, function* () {
            const onModifyMsg = createMsgSaga(modifyMessageAction, function* () {
                yield put(messageChangedEvent({ newMessage: 'world!' }));
            });

            yield takeEvery(modifyMessageAction, onModifyMsg);
        });

        const getModule1State = createModuleSelector(module1Def);
        const getMessage = createSelector(getModule1State, state => state.message);

        const module1 = createModule(module1Def, { reducer: reducer1, saga: saga1 });
        const store = createStore({
            modules: [module1],
        });

        let state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('hello');

        // start app

        const rootDef = defineModule({ moduleName: 'root' }, withState());
        const root = createModule(rootDef, {
            saga: createModuleSaga(rootDef, function* () {
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
