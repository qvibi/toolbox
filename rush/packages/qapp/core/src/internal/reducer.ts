import { Reducer, combineReducers as reduxCombineReducers } from 'redux';

import { AnyQAppModuleDef, ExtractQAppModuleState } from './module';
import { AnyQAppMessage, AnyQAppMessageDef, ExtractQAppMessage } from './message';

export interface IQAppReducer<TModuleDef extends AnyQAppModuleDef> extends Reducer<ExtractQAppModuleState<TModuleDef>, AnyQAppMessage> {
    (state: ExtractQAppModuleState<TModuleDef>, msg: AnyQAppMessage): ExtractQAppModuleState<TModuleDef>;
}

export type IQAppReducersMap<TModuleDef extends AnyQAppModuleDef> = {
    [K in keyof ExtractQAppModuleState<TModuleDef>]: IQAppReducer<ExtractQAppModuleState<TModuleDef>[K]>;
};

export interface IQAppReducerMutator<TModuleDef extends AnyQAppModuleDef, TMsgDef extends AnyQAppMessageDef> {
    msgDef: TMsgDef;
    mutate: (
        state: Readonly<ExtractQAppModuleState<TModuleDef>>,
        payload: ExtractQAppMessage<TMsgDef>['payload'],
        msg: ExtractQAppMessage<TMsgDef>,
    ) => ExtractQAppModuleState<TModuleDef>;
}

export type ExtractQAppReducerState<TReducer> = TReducer extends IQAppReducer<infer TState> ? TState : never;

// type Exact<T, U> = T extends U ? (Exclude<keyof T, keyof U> extends never ? T : never) : never;

export function createModuleReducer<TModuleDef extends AnyQAppModuleDef>(
    moduleDef: TModuleDef,
    initialState: ExtractQAppModuleState<TModuleDef>,
    mutators: IQAppReducerMutator<TModuleDef, AnyQAppMessageDef>[],
): IQAppReducer<TModuleDef> {
    const map = mutators.reduce((acc: { [msgType: string]: IQAppReducerMutator<TModuleDef, AnyQAppMessageDef> }, h) => {
        if (acc[h.msgDef.type.toString()]) {
            // only one handler per MessageDef
            throw new Error(`handler already defined for message '${h.msgDef.type}'`);
        }

        acc[h.msgDef.type] = h;
        return acc;
    }, {});

    return (state = initialState, msg: AnyQAppMessage): ExtractQAppModuleState<TModuleDef> => {
        if (map[msg.type]) {
            return map[msg.type].mutate(state, msg.payload, msg);
        } else {
            return state;
        }
    };
}

export function combineReducers<TModuleDef extends AnyQAppModuleDef>(reducers: IQAppReducersMap<TModuleDef>): IQAppReducer<TModuleDef> {
    return reduxCombineReducers(reducers) as IQAppReducer<TModuleDef>;
}

export function on<
    TModuleDef extends AnyQAppModuleDef,
    TState extends ExtractQAppModuleState<TModuleDef>,
    // TMutateResult,
    TMsgDef extends AnyQAppMessageDef
>(
    msgDef: TMsgDef,
    mutate: (state: Readonly<TState>, payload: ExtractQAppMessage<TMsgDef>['payload'], msg: ExtractQAppMessage<TMsgDef>) => TState,
    // ) => Exact<TMutateResult, TState>,
): IQAppReducerMutator<TModuleDef, TMsgDef> {
    return {
        msgDef,
        mutate,
    };
}

export function getCreateModuleReducerTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return (initialState: ExtractQAppModuleState<TModuleDef>, mutators: IQAppReducerMutator<TModuleDef, AnyQAppMessageDef>[]) =>
        createModuleReducer(moduleDef, initialState, mutators);
}
