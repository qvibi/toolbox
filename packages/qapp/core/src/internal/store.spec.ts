import { createQApp } from './store';
import { createModule, defineModule, withState } from './module';
import { getModuleTools } from './tools';
import { createSelector } from './selector';

describe('store', () => {
    it('should work', () => {
        const MODULE_DEF = defineModule({ moduleName: 'module1' }, withState<{ message: string }>());
        const { createReducer, getState } = getModuleTools(MODULE_DEF);
        const reducer1 = createReducer({ message: 'hello' }, []);

        const MODULE = createModule(MODULE_DEF, { reducer: reducer1 });

        const store = createQApp({
            modules: [MODULE],
        });

        const getMessage = createSelector(getState, state => state.message);

        const state = store.getReduxStore().getState();
        expect(getMessage(state)).toEqual('hello');
    });
});
