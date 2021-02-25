/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { IQvibiModule } from '@qvibi-toolbox/core';

import { IQAppReducer } from './reducer';
import { IQAppModuleSaga } from './saga';

export interface IQAppModule<TModuleDef extends AnyQAppModuleDef> extends IQvibiModule<ExtractQAppModuleName<TModuleDef>> {
    reducer: IQAppReducer<TModuleDef> | null;
    saga: IQAppModuleSaga<TModuleDef> | null;
}

export type AnyQAppModule = IQAppModule<any>;

export interface IQAppModuleOptions<TModuleDef extends AnyQAppModuleDef> {
    reducer?: IQAppReducer<TModuleDef>;
    saga?: IQAppModuleSaga<TModuleDef> | null;
}

export interface IQAppModuleDefOptions<TFeatureName extends string, _TState> {
    moduleName: TFeatureName;
}

export interface IQAppModuleDef<TFeatureName extends `${string}`, _TState> {
    moduleName: TFeatureName;
}

export type AnyQAppModuleDef = IQAppModuleDef<any, any>;

export type ExtractQAppModuleName<T> = T extends IQAppModuleDef<infer TModuleName, any> ? TModuleName : never;
export type ExtractQAppModuleState<T> = T extends IQAppModuleDef<any, infer TState> ? TState : never;

export function defineModule<TModuleName extends `${string}`, TState>(
    defOptions: IQAppModuleDefOptions<TModuleName, TState>,
    _state: TState,
): IQAppModuleDef<`${TModuleName}`, TState> {
    return {
        moduleName: `${defOptions.moduleName}` as `${TModuleName}`,
    };
}

export function withState<TState = {}>(): TState {
    return null;
}

export function createModule<TModuleDef extends AnyQAppModuleDef>(
    moduleDef: TModuleDef,
    options: IQAppModuleOptions<TModuleDef>,
): IQAppModule<TModuleDef> {
    return {
        moduleName: moduleDef.moduleName,
        reducer: options.reducer,
        saga: options.saga,
    };
}
