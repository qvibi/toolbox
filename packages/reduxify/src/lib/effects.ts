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

type SagaResult<TResult> = Generator<unknown, TResult>;
type ExtractSagaResult<T> = T extends SagaResult<infer TResult> ? TResult : never;

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

function takeEvery<T extends AnyQvibiMessageDef>(msgDef: T, worker: (msg: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeEvery<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: (msgs: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeEvery(
    msgDef: AnyQvibiMessageDef | AnyQvibiMessageDef[],
    worker: (msgs: ExtractQvibiMessage<AnyQvibiMessageDef | AnyQvibiMessageDef[]>) => void,
): ForkEffect<never> {
    return sagaTakeEvery(defToPattern(msgDef), worker);
}

function takeLatest<T extends AnyQvibiMessageDef>(msgDef: T, worker: (msg: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeLatest<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: (msgs: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeLatest(
    msgDef: AnyQvibiMessageDef | AnyQvibiMessageDef[],
    worker: (msgs: ExtractQvibiMessage<AnyQvibiMessageDef | AnyQvibiMessageDef[]>) => void,
): ForkEffect<never> {
    return sagaTakeLatest(defToPattern(msgDef), worker);
}

function takeLeading<T extends AnyQvibiMessageDef>(msgDef: T, worker: (msg: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeLeading<T extends AnyQvibiMessageDef[]>(msgDefs: T, worker: (msgs: ExtractQvibiMessage<T>) => void): ForkEffect<never>;
function takeLeading(
    msgDef: AnyQvibiMessageDef | AnyQvibiMessageDef[],
    worker: (msgs: ExtractQvibiMessage<AnyQvibiMessageDef | AnyQvibiMessageDef[]>) => void,
): ForkEffect<never> {
    return sagaTakeLeading(defToPattern(msgDef), worker);
}

function put(msg: AnyQvibiMessage): PutEffect<AnyQvibiMessage> {
    return sagaPut(msg);
}

function* select<TResult, Fn extends (state: unknown, ...args: unknown[]) => TResult>(selector: Fn): SagaResult<ReturnType<Fn>> {
    const result = (yield sagaSelect(selector as never)) as ReturnType<Fn>;
    return result;
}

type QvibiEffectHandler<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]> = (msg: ExtractQvibiMessage<T>) => SagaResult<void>;
type QvibiEffect<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]> = (msg: ExtractQvibiMessage<T>) => SagaResult<void>;
function createEffect<T extends AnyQvibiMessageDef>(msgDef: T, handler: QvibiEffectHandler<T>): QvibiEffect<T>;
function createEffect<T extends AnyQvibiMessageDef[]>(msgDefs: T, handler: QvibiEffectHandler<T>): QvibiEffect<T>;
function createEffect<T extends AnyQvibiMessageDef | AnyQvibiMessageDef[]>(_msgDef: T, handler: QvibiEffectHandler<T>): QvibiEffect<T> {
    return handler;
}

type QvibiModuleEffectHandler<T extends AnyQvibiFrontEndModuleDef> = () => SagaResult<void>;
type QvibiModuleEffect<T extends AnyQvibiFrontEndModuleDef> = () => SagaResult<void>;
function createEffects<T extends AnyQvibiFrontEndModuleDef>(moduleDef: T, handler: QvibiModuleEffectHandler<T>): QvibiModuleEffect<T> {
    return handler;
}

export { SagaResult, ExtractSagaResult };
export { take, takeEvery, takeLatest, takeLeading, put };
export { race, call, select, cancel, cancelled, fork, all, delay };
export { QvibiEffect, createEffect, QvibiModuleEffect, createEffects };
