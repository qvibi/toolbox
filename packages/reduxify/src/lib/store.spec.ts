import { createModule, defineModule, withState } from './module';
import { createReducer } from './reducer';
import { createStore } from './store';
import { createModuleSelector, createSelector } from './selectors';

describe('store', () => {
    it('should work', () => {
        const module1Def = defineModule({ moduleName: 'module1' }, withState<{ message: string }>());
        const reducer1 = createReducer(module1Def, { message: 'hello' }, []);
        const module1 = createModule(module1Def, { reducer: reducer1 });

        const store = createStore({
            modules: [module1],
        });

        const getModule1State = createModuleSelector(module1Def);
        const getMessage = createSelector(getModule1State, state => state.message);

        const state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('hello');
    });
});
