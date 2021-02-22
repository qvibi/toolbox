import {
    defineModule,
    withState,
    createReducer,
    createStore,
    createModuleSelector,
    createSelector,
    defineMsg,
    withPayload,
    mutate,
    createEffects,
    createEffect,
    put,
    takeEvery,
} from './index';

describe('reduxify', () => {
    it('should work', async () => {
        const module1Def = defineModule({ moduleName: 'module1' }, withState<{ message: string }>());

        const msg11Def = defineMsg(module1Def, 'modify_message', withPayload());
        const msg12Def = defineMsg(module1Def, 'message_changed', withPayload<{ newMessage: string }>());

        const reducer1 = createReducer(module1Def, { message: 'hello' }, [
            mutate(msg12Def, (state, msg) => {
                return {
                    ...state,
                    message: msg.payload.newMessage,
                };
            }),
        ]);

        const effects1 = createEffects(module1Def, function* () {
            const onMsg1 = createEffect(msg11Def, function* () {
                yield put(msg12Def({ newMessage: 'world!' }));
            });

            yield takeEvery(msg11Def, onMsg1);
        });

        const module1 = module1Def.create({ reducer: reducer1, effects: effects1 });
        const store = createStore({
            modules: [module1],
        });

        const getModule1State = createModuleSelector(module1Def);
        const getMessage = createSelector(getModule1State, state => state.message);

        let state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('hello');

        // start app

        const rootDef = defineModule({ moduleName: 'root' }, withState());
        const root = rootDef.create({
            effects: createEffects(rootDef, function* () {
                yield put(msg11Def({}));
            }),
        });
        store.addModule(root);

        await new Promise(resolve => setTimeout(resolve, 100));
        await store.complete();

        state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('world!');
    });
});
