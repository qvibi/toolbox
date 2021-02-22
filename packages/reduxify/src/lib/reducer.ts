import { Reducer, combineReducers as reduxCombineReducers } from 'redux';

import { AnyQvibiFrontEndModuleDef, ExtractQvibiFrontEndModuleState } from './module';
import { AnyQvibiMessage, AnyQvibiMessageDef, ExtractQvibiMessage } from './message';

export interface IQvibiReducer<TState> extends Reducer<TState, AnyQvibiMessage> {
    (state: TState, msg: AnyQvibiMessage): TState;
}

export type IQvibiReducersMap<TState> = {
    [K in keyof TState]: IQvibiReducer<TState[K]>;
};

export interface IQvibiReducerMutator<TState, TMsgDef extends AnyQvibiMessageDef> {
    msgDef: TMsgDef;
    mutate: (state: Readonly<TState>, msg: ExtractQvibiMessage<TMsgDef>) => TState;
}

export type ExtractQvibiReducerState<TReducer> = TReducer extends IQvibiReducer<infer TState> ? TState : never;

type Exact<T, U> = T extends U ? (Exclude<keyof T, keyof U> extends never ? T : never) : never;

export function createReducer<TModuleDef extends AnyQvibiFrontEndModuleDef, TState extends ExtractQvibiFrontEndModuleState<TModuleDef>>(
    _moduleDef: TModuleDef,
    initialState: TState,
    mutators: IQvibiReducerMutator<TState, AnyQvibiMessageDef>[],
): IQvibiReducer<TState> {
    const map = mutators.reduce((acc: { [msgType: string]: IQvibiReducerMutator<TState, AnyQvibiMessageDef> }, h) => {
        if (acc[h.msgDef.type.toString()]) {
            // only one handler per MessageDef
            throw new Error(`handler already defined for message '${h.msgDef.type}'`);
        }

        acc[h.msgDef.type] = h;
        return acc;
    }, {});

    return (state = initialState, msg: AnyQvibiMessage): TState => {
        if (map[msg.type]) {
            return map[msg.type].mutate(state, msg);
        } else {
            return state;
        }
    };
}

export function combineReducers<TState>(reducers: IQvibiReducersMap<TState>): IQvibiReducer<TState> {
    return reduxCombineReducers(reducers);
}

export function mutate<TState, TMutateResult, TMsgDef extends AnyQvibiMessageDef>(
    msgDef: TMsgDef,
    mutate: (state: Readonly<TState>, msg: ExtractQvibiMessage<TMsgDef>) => Exact<TMutateResult, TState>,
): IQvibiReducerMutator<TState, TMsgDef> {
    return {
        msgDef,
        mutate,
    };
}
