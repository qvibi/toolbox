import { AnyQAppMessageDef, ExtractQAppMessage } from './message';
import { AnyQAppModuleDef } from './module';

export type IQAppSagaResult<TResult> = Generator<any, TResult, never>;
export type QAppExtractResult<T> = T extends (...args: any) => infer R
    ? R extends IQAppSagaResult<infer X>
        ? X
        : R extends Promise<infer X>
        ? X
        : never
    : never;

export type IQAppMsgSaga<T extends AnyQAppMessageDef | AnyQAppMessageDef[]> = (msg: ExtractQAppMessage<T>) => IQAppSagaResult<void>;
export type IQAppModuleSaga<_T extends AnyQAppModuleDef> = () => IQAppSagaResult<void>;

export function createMsgSaga<T extends AnyQAppMessageDef>(msgDef: T, worker: IQAppMsgSaga<T>): IQAppMsgSaga<T>;
export function createMsgSaga<T extends AnyQAppMessageDef[]>(msgDefs: T, worker: IQAppMsgSaga<T>): IQAppMsgSaga<T>;
export function createMsgSaga<T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(_msgDef: T, worker: IQAppMsgSaga<T>): IQAppMsgSaga<T> {
    return worker;
}

export function createModuleSaga<T extends AnyQAppModuleDef>(moduleDef: T, worker: IQAppModuleSaga<T>): IQAppModuleSaga<T> {
    return worker;
}
