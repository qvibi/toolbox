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

export type IQAppMsgSaga<TModuleDef extends AnyQAppModuleDef, TMsg extends AnyQAppMessageDef | AnyQAppMessageDef[]> = (
    payload: ExtractQAppMessage<TMsg>['payload'],
    msg: ExtractQAppMessage<TMsg>,
) => IQAppSagaResult<void>;
export type IQAppModuleSaga<TModuleDef extends AnyQAppModuleDef> = () => IQAppSagaResult<void>;

export function createMsgSaga<TModuleDef extends AnyQAppModuleDef, TMsg extends AnyQAppMessageDef>(
    moduleDef: TModuleDef,
    msgDef: TMsg,
    worker: IQAppMsgSaga<TModuleDef, TMsg>,
): IQAppMsgSaga<TModuleDef, TMsg>;
export function createMsgSaga<TModuleDef extends AnyQAppModuleDef, TMsgs extends AnyQAppMessageDef[]>(
    moduleDef: TModuleDef,
    msgDefs: TMsgs,
    worker: IQAppMsgSaga<TModuleDef, TMsgs>,
): IQAppMsgSaga<TModuleDef, TMsgs>;
export function createMsgSaga<TModuleDef extends AnyQAppModuleDef, T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(
    moduleDef: TModuleDef,
    _msgDef: T,
    worker: IQAppMsgSaga<TModuleDef, T>,
): IQAppMsgSaga<TModuleDef, T> {
    return worker;
}

export function createModuleSaga<TModuleDef extends AnyQAppModuleDef>(
    moduleDef: TModuleDef,
    worker: IQAppModuleSaga<TModuleDef>,
): IQAppModuleSaga<TModuleDef> {
    return worker;
}

export function getCreateMsgSagaTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    function create<TMsg extends AnyQAppMessageDef>(msgDef: TMsg, worker: IQAppMsgSaga<TModuleDef, TMsg>): IQAppMsgSaga<TModuleDef, TMsg>;
    function create<TMsgs extends AnyQAppMessageDef[]>(msgDefs: TMsgs, worker: IQAppMsgSaga<TModuleDef, TMsgs>): IQAppMsgSaga<TModuleDef, TMsgs>;
    function create<T extends AnyQAppMessageDef | AnyQAppMessageDef[]>(_msgDef: T, worker: IQAppMsgSaga<TModuleDef, T>): IQAppMsgSaga<TModuleDef, T> {
        return worker;
    }

    return create;
}

export function getCreateModuleSagaTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return (worker: IQAppModuleSaga<TModuleDef>) => createModuleSaga(moduleDef, worker);
}
