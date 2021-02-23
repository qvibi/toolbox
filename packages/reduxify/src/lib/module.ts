/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { IQvibiModule } from '@qvibi-toolbox/core';
import { QvibiModuleSaga } from './effects';
import { IQvibiReducer } from './reducer';

export interface IQvibiFrontEndModule<TModuleDef extends AnyQvibiFrontEndModuleDef> extends IQvibiModule<ExtractQvibiFrontEndModuleName<TModuleDef>> {
    reducer: IQvibiReducer<TModuleDef> | null;
    saga: QvibiModuleSaga<TModuleDef> | null;
}

export type AnyQvibiFrontEndModule = IQvibiFrontEndModule<any>;

export interface IQvibiFrontEndModuleOptions<TModuleDef extends AnyQvibiFrontEndModuleDef> {
    reducer?: IQvibiReducer<TModuleDef>;
    saga?: QvibiModuleSaga<TModuleDef> | null;
}

export interface IQvibiFrontEndModuleDefOptions<TFeatureName extends string, _TState> {
    moduleName: TFeatureName;
}

export interface IQvibiFrontEndModuleDef<TFeatureName extends `${string}`, _TState> {
    moduleName: TFeatureName;
}

export type AnyQvibiFrontEndModuleDef = IQvibiFrontEndModuleDef<any, any>;

export type ExtractQvibiFrontEndModuleName<T> = T extends IQvibiFrontEndModuleDef<infer TModuleName, any> ? TModuleName : never;
export type ExtractQvibiFrontEndModuleState<T> = T extends IQvibiFrontEndModuleDef<any, infer TState> ? TState : never;

export function defineModule<TModuleName extends `${string}`, TState>(
    defOptions: IQvibiFrontEndModuleDefOptions<TModuleName, TState>,
    _state: TState,
): IQvibiFrontEndModuleDef<`${TModuleName}`, TState> {
    return {
        moduleName: `${defOptions.moduleName}` as `${TModuleName}`,
    };
}

export interface NoState extends Record<string, never> {}

export function withState<TState = NoState>(_payload?: TState): TState {
    return null;
}

export function createModule<TModuleDef extends AnyQvibiFrontEndModuleDef>(
    moduleDef: TModuleDef,
    options: IQvibiFrontEndModuleOptions<TModuleDef>,
): IQvibiFrontEndModule<TModuleDef> {
    return {
        moduleName: moduleDef.moduleName,
        reducer: options.reducer,
        saga: options.saga,
    };
}
