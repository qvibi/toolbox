import { Reducer, combineReducers as reduxCombineReducers } from 'redux';

import { AnyQvibiFrontEndModuleDef, ExtractQvibiFrontEndModuleState } from './module';
import { AnyQvibiMessage, AnyQvibiMessageDef, ExtractQvibiMessage } from './message';

export interface IQvibiReducer<TModuleDef extends AnyQvibiFrontEndModuleDef>
    extends Reducer<ExtractQvibiFrontEndModuleState<TModuleDef>, AnyQvibiMessage> {
    (state: ExtractQvibiFrontEndModuleState<TModuleDef>, msg: AnyQvibiMessage): ExtractQvibiFrontEndModuleState<TModuleDef>;
}

export type IQvibiReducersMap<TModuleDef extends AnyQvibiFrontEndModuleDef> = {
    [K in keyof ExtractQvibiFrontEndModuleState<TModuleDef>]: IQvibiReducer<ExtractQvibiFrontEndModuleState<TModuleDef>[K]>;
};

export interface IQvibiReducerMutator<TModuleDef extends AnyQvibiFrontEndModuleDef, TMsgDef extends AnyQvibiMessageDef> {
    msgDef: TMsgDef;
    mutate: (
        state: Readonly<ExtractQvibiFrontEndModuleState<TModuleDef>>,
        payload: ExtractQvibiMessage<TMsgDef>['payload'],
        msg: ExtractQvibiMessage<TMsgDef>,
    ) => ExtractQvibiFrontEndModuleState<TModuleDef>;
}

export type ExtractQvibiReducerState<TReducer> = TReducer extends IQvibiReducer<infer TState> ? TState : never;

type Exact<T, U> = T extends U ? (Exclude<keyof T, keyof U> extends never ? T : never) : never;

export function createReducer<TModuleDef extends AnyQvibiFrontEndModuleDef, TState extends ExtractQvibiFrontEndModuleState<TModuleDef>>(
    _moduleDef: TModuleDef,
    initialState: TState,
    mutators: IQvibiReducerMutator<TModuleDef, AnyQvibiMessageDef>[],
): IQvibiReducer<TModuleDef> {
    const map = mutators.reduce((acc: { [msgType: string]: IQvibiReducerMutator<TModuleDef, AnyQvibiMessageDef> }, h) => {
        if (acc[h.msgDef.type.toString()]) {
            // only one handler per MessageDef
            throw new Error(`handler already defined for message '${h.msgDef.type}'`);
        }

        acc[h.msgDef.type] = h;
        return acc;
    }, {});

    return (state = initialState, msg: AnyQvibiMessage): TState => {
        if (map[msg.type]) {
            return map[msg.type].mutate(state, msg.payload, msg);
        } else {
            return state;
        }
    };
}

export function combineReducers<TModuleDef extends AnyQvibiFrontEndModuleDef>(reducers: IQvibiReducersMap<TModuleDef>): IQvibiReducer<TModuleDef> {
    return reduxCombineReducers(reducers) as IQvibiReducer<TModuleDef>;
}

export function on<
    TModuleDef extends AnyQvibiFrontEndModuleDef,
    TState extends ExtractQvibiFrontEndModuleState<TModuleDef>,
    TMutateResult,
    TMsgDef extends AnyQvibiMessageDef
>(
    msgDef: TMsgDef,
    mutate: (state: Readonly<TState>, payload: ExtractQvibiMessage<TMsgDef>['payload'], msg: ExtractQvibiMessage<TMsgDef>) => TState,
    // ) => Exact<TMutateResult, TState>,
): IQvibiReducerMutator<TModuleDef, TMsgDef> {
    return {
        msgDef,
        mutate,
    };
}
