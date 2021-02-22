/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-interface */

import { IQvibiModule } from '@qvibi-toolbox/core';
import { QvibiModuleEffect } from './effects';
import { IQvibiReducer } from './reducer';

export interface IQvibiFrontEndModule<TModuleDef extends AnyQvibiFrontEndModuleDef> extends IQvibiModule<ExtractQvibiFrontEndModuleName<TModuleDef>> {
    reducer: IQvibiReducer<ExtractQvibiFrontEndModuleState<TModuleDef>> | null;
    effects: QvibiModuleEffect<TModuleDef> | null;
}

export type AnyQvibiFrontEndModule = IQvibiFrontEndModule<any>;

export interface IQvibiFrontEndModuleOptions<TModuleDef extends AnyQvibiFrontEndModuleDef> {
    reducer?: IQvibiReducer<ExtractQvibiFrontEndModuleState<TModuleDef>>;
    effects?: QvibiModuleEffect<TModuleDef> | null;
}

export interface IQvibiFrontEndModuleDefOptions<TFeatureName extends string, _TState> {
    moduleName: TFeatureName;
}

export interface IQvibiFrontEndModuleDef<TFeatureName extends `${string}`, _TState> {
    moduleName: TFeatureName;
    create(options: IQvibiFrontEndModuleOptions<this>): IQvibiFrontEndModule<this>;
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
        create: options => {
            return {
                moduleName: `${defOptions.moduleName}` as `${TModuleName}`,
                reducer: options.reducer,
                effects: options.effects,
            };
        },
    };
}

export interface NoState extends Record<string, never> {}

export function withState<TState = NoState>(_payload?: TState): TState {
    return null;
}
