import { createStore as createReduxStore, compose, applyMiddleware, Store, Middleware } from 'redux';
import createSagaMiddleware, { Task, END } from 'redux-saga';
import { take as sagaTake } from 'redux-saga/effects';

import { AnyQAppModule, AnyQAppModuleDef } from './module';
import { createStoreMiddlwareMngr } from './middlewares';
import { AnyQAppMessage } from './message';
import { combineReducers, IQAppReducersMap } from './reducer';

export interface IQApp {
    addMiddlware(middlware: Middleware): void;
    addModule(module: AnyQAppModule): void;

    getReduxStore(): Store<Record<string, unknown>, AnyQAppMessage>;

    complete(): Promise<void>;
}

export interface IQAppStoreOptions {
    modules: AnyQAppModule[];
}

export function createQApp(options: IQAppStoreOptions): IQApp {
    const modules = [...options.modules];

    const reducers: IQAppReducersMap<AnyQAppModuleDef> = {};
    const effects: { [moduleName: string]: Task } = {};

    const initialReducers = combineReducers<AnyQAppModuleDef>({ none: (state = 0) => state });
    const initialState: Record<string, unknown> = { none: 0 };

    const sagaRuntime = createSagaMiddleware();
    const middlwares = createStoreMiddlwareMngr();

    let composeEnhancers = compose;
    if (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) {
        composeEnhancers = (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ as typeof compose) || compose;
    }

    const store = createReduxStore(initialReducers, initialState, composeEnhancers(applyMiddleware(sagaRuntime, middlwares.enhancer)));

    // register reducers
    modules.forEach(m => {
        if (m.reducer) {
            reducers[m.moduleName] = m.reducer;
        }
    });

    if (Object.keys(reducers).length !== 0) {
        store.replaceReducer(combineReducers(reducers));
    }

    // register sagas
    modules.forEach(m => {
        if (m.saga) {
            effects[m.moduleName] = sagaRuntime.run(m.saga);
        }
    });

    return {
        getReduxStore: () => store,
        addModule: module => {
            if (module.reducer) {
                reducers[module.moduleName] = module.reducer;
                store.replaceReducer(combineReducers(reducers));
            }

            if (module.saga) {
                effects[module.moduleName] = sagaRuntime.run(module.saga);
            }
        },
        addMiddlware: (middlware: Middleware) => {
            middlwares.addMiddleware(middlware);
        },
        complete: () => {
            const task = sagaRuntime.run(function* () {
                yield sagaTake(END.type as any);
            });

            store.dispatch(END as any);

            return task.toPromise();
        },
    };
}
