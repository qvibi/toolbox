import {
    takeEvery as sagaTakeEvery,
    takeLeading as sagaTakeLeading,
    takeLatest as sagaTakeLatest,
    take as sagaTake,
    race,
    put as sagaPut,
    call,
    select as sagaSelect,
    cancel,
    cancelled,
    fork,
    all,
    delay,
    ForkEffect,
    PutEffect,
} from 'redux-saga/effects';

import { AnyQAppMessage, AnyQAppMessageDef, ExtractQAppMessage } from './message';
import { AnyQAppModuleDef } from './module';
import { IQAppMsgSaga, IQAppSagaResult } from './saga';

function defToPattern(msgDef: AnyQAppMessageDef | AnyQAppMessageDef[]): string | string[] {
    if (Array.isArray(msgDef)) {
        return msgDef.map(def => def.type);
    }

    return msgDef.type;
}

function take<T extends AnyQAppMessageDef>(msgDef: T): IQAppSagaResult<ExtractQAppMessage<T>>;
function take<T extends AnyQAppMessageDef[]>(msgDefs: T): IQAppSagaResult<ExtractQAppMessage<T>>;
function take(msgDef: AnyQAppMessageDef | AnyQAppMessageDef[]): unknown {
    return sagaTake(defToPattern(msgDef));
}

function takeEvery<T extends AnyQAppMessageDef>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeEvery<T extends AnyQAppMessageDef[]>(msgDefs: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeEvery<T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never> {
    return sagaTakeEvery(defToPattern(msgDef), function (msg: ExtractQAppMessage<T>) {
        return worker(msg.payload, msg);
    });
}

function takeLatest<T extends AnyQAppMessageDef>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeLatest<T extends AnyQAppMessageDef[]>(msgDefs: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeLatest<T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never> {
    return sagaTakeLatest(defToPattern(msgDef), function (msg: ExtractQAppMessage<T>) {
        return worker(msg.payload, msg);
    });
}

function takeLeading<T extends AnyQAppMessageDef>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeLeading<T extends AnyQAppMessageDef[]>(msgDefs: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never>;
function takeLeading<T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(msgDef: T, worker: IQAppMsgSaga<AnyQAppModuleDef, T>): ForkEffect<never> {
    return sagaTakeLeading(defToPattern(msgDef), function (msg: ExtractQAppMessage<T>) {
        return worker(msg.payload, msg);
    });
}

function put(msg: AnyQAppMessage): PutEffect<AnyQAppMessage> {
    return sagaPut(msg);
}

function* select<TResult, Fn extends (state: unknown, ...args: unknown[]) => TResult>(selector: Fn): IQAppSagaResult<ReturnType<Fn>> {
    const result = (yield sagaSelect(selector as never)) as ReturnType<Fn>;
    return result;
}

export { take, takeEvery, takeLatest, takeLeading, put };
export { race, call, select, cancel, cancelled, fork, all, delay };
