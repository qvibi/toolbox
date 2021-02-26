import { createSelector } from 'reselect';

import { AnyQAppModuleDef, ExtractQAppModuleState } from './module';

export { createSelector };

export function createModuleSelector<TModuleDef extends AnyQAppModuleDef>(
    moduleDef: TModuleDef,
): (store: Record<string, any>) => ExtractQAppModuleState<TModuleDef> {
    return store => store[moduleDef.moduleName] as ExtractQAppModuleState<TModuleDef>;
}
