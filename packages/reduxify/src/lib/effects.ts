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
    RaceEffect,
} from 'redux-saga/effects';

import { AnyQvibiMessage, AnyQvibiMessageDef, ExtractQvibiMessage } from './message';
import { AnyQvibiFrontEndModuleDef } from './module';

type SagaResult<TResult> = Generator<any, TResult, never>;
type ExtractSagaResult<T> = T extends SagaResult<infer TResult> ? TResult : never;
type ExtractResult<T> = T extends (...args: any) => infer R ? (R extends SagaResult<infer X> ? X : R extends Promise<infer X> ? X : never) : never;

type QvibiMsgSaga<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]> = (msg: ExtractQvibiMessage<T>) => SagaResult<void>;
type QvibiModuleSaga<_T extends AnyQvibiFrontEndModuleDef> = () => SagaResult<void>;

function defToPattern(msgDef: AnyQvibiMessageDef | AnyQvibiMessageDef[]): string | string[] {
    if (Array.isArray(msgDef)) {
        return msgDef.map(def => def.type);
    }

    return msgDef.type;
}

function take<T extends AnyQvibiMessageDef>(msgDef: T): SagaResult<ExtractQvibiMessage<T>>;
function take<T extends AnyQvibiMessageDef[]>(msgDefs: T): SagaResult<ExtractQvibiMessage<T>>;
function take(msgDef: AnyQvibiMessageDef | AnyQvibiMessageDef[]): unknown {
    return sagaTake(defToPattern(msgDef));
}

function takeEvery<T extends AnyQvibiMessageDef>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeEvery<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeEvery<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never> {
    return sagaTakeEvery(defToPattern(msgDef), worker);
}

function takeLatest<T extends AnyQvibiMessageDef>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeLatest<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeLatest<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never> {
    return sagaTakeLatest(defToPattern(msgDef), worker);
}

function takeLeading<T extends AnyQvibiMessageDef>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeLeading<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: QvibiMsgSaga<T>): ForkEffect<never>;
function takeLeading<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]>(msgDef: T, worker: QvibiMsgSaga<T>): ForkEffect<never> {
    return sagaTakeLeading(defToPattern(msgDef), worker);
}

function put(msg: AnyQvibiMessage): PutEffect<AnyQvibiMessage> {
    return sagaPut(msg);
}

function* select<TResult, Fn extends (state: unknown, ...args: unknown[]) => TResult>(selector: Fn): SagaResult<ReturnType<Fn>> {
    const result = (yield sagaSelect(selector as never)) as ReturnType<Fn>;
    return result;
}

function createMsgSaga<T extends AnyQvibiMessageDef>(msgDef: T, worker: QvibiMsgSaga<T>): QvibiMsgSaga<T>;
function createMsgSaga<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: QvibiMsgSaga<T>): QvibiMsgSaga<T>;
function createMsgSaga<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]>(_msgDef: T, worker: QvibiMsgSaga<T>): QvibiMsgSaga<T> {
    return worker;
}

function createModuleSaga<T extends AnyQvibiFrontEndModuleDef>(moduleDef: T, worker: QvibiModuleSaga<T>): QvibiModuleSaga<T> {
    return worker;
}

export { SagaResult, ExtractResult };
export { take, takeEvery, takeLatest, takeLeading, put };
export { race, call, select, cancel, cancelled, fork, all, delay };
export { QvibiMsgSaga, createMsgSaga, QvibiModuleSaga, createModuleSaga };
