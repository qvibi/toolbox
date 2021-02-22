import React from 'react';
import { Provider } from 'react-redux';
import { createStore as createReduxStore, compose, applyMiddleware, Store, Middleware } from 'redux';
import createSagaMiddleware, { Task, END } from 'redux-saga';
import { take as sagaTake } from 'redux-saga/effects';

import isEmpty from 'lodash/isEmpty';

import { AnyQvibiFrontEndModule } from './module';
import { createStoreMiddlwareMngr } from './middlewares';
import { AnyQvibiMessage } from './message';
import { combineReducers, IQvibiReducersMap } from './reducer';

export interface IQvibiStore {
    addMiddlware(middlware: Middleware): void;
    addModule(module: AnyQvibiFrontEndModule): void;

    getReduxStore(): Store<Record<string, unknown>, AnyQvibiMessage>;

    complete(): Promise<void>;
}

export interface IQvibiStoreOptions {
    modules: AnyQvibiFrontEndModule[];
}

export function createStore(options: IQvibiStoreOptions): IQvibiStore {
    const modules = [...options.modules];

    const reducers: IQvibiReducersMap<Record<string, unknown>> = {};
    const effects: { [moduleName: string]: Task } = {};

    const initialReducers = combineReducers<Record<string, unknown>>({ none: (state = 0) => state });
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

    if (!isEmpty(reducers)) {
        store.replaceReducer(combineReducers(reducers));
    }

    // register sagas
    modules.forEach(m => {
        if (m.effects) {
            effects[m.moduleName] = sagaRuntime.run(m.effects);
        }
    });

    return {
        getReduxStore: () => store,
        addModule: module => {
            if (module.reducer) {
                reducers[module.moduleName] = module.reducer;
                store.replaceReducer(combineReducers(reducers));
            }

            if (module.effects) {
                effects[module.moduleName] = sagaRuntime.run(module.effects);
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

export function withStore(store: IQvibiStore, node: React.ReactNode) {
    return <Provider store={store.getReduxStore()}>{node}</Provider>;
}
