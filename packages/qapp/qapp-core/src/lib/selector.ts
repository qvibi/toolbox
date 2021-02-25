import { createSelector } from 'reselect';

import { AnyQAppModuleDef, ExtractQAppModuleState } from './module';

export function createModuleSelector<TModuleDef extends AnyQAppModuleDef, TState extends ExtractQAppModuleState<TModuleDef>>(
    moduleDef: TModuleDef,
): (store: Record<string, unknown>) => TState {
    return store => store[moduleDef.moduleName] as TState;
}

export { createSelector };
