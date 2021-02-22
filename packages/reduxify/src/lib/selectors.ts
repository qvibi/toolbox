import { createSelector } from 'reselect';
import { AnyQvibiFrontEndModuleDef, ExtractQvibiFrontEndModuleState } from './module';

export { createSelector };

export function createModuleSelector<TModuleDef extends AnyQvibiFrontEndModuleDef, TState extends ExtractQvibiFrontEndModuleState<TModuleDef>>(
    moduleDef: TModuleDef,
): (store: Record<string, unknown>) => TState {
    return store => store[moduleDef.moduleName] as TState;
}
