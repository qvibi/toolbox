import { Action } from 'redux';
import { AnyQAppModuleDef, ExtractQAppModuleName } from './module';

export interface IQAppMessage<TModuleDef extends AnyQAppModuleDef, TType, TPayload> extends Action<TType> {
    readonly type: TType;
    readonly payload: Readonly<TPayload>;
}

export interface IQAppMessageDef<TModuleDef extends AnyQAppModuleDef, TType, _TPayload> {
    type: TType;
}

export interface IQAppMessageCreator<TModuleDef extends AnyQAppModuleDef, TType, TPayload> extends IQAppMessageDef<TModuleDef, TType, TPayload> {
    (payload: TPayload): IQAppMessage<TModuleDef, TType, TPayload>;
    readOnly(): IQAppMessageDef<TModuleDef, TType, TPayload>;
}

export type AnyQAppMessageDef = IQAppMessageDef<AnyQAppModuleDef, string, unknown>;
export type AnyQAppMessage = IQAppMessage<AnyQAppModuleDef, string, unknown>;

export type ExtractQAppMessage<TMessageDef> = TMessageDef extends Array<infer TInnerDefs>
    ? TInnerDefs extends IQAppMessageCreator<infer TModuleDef, infer TType, infer TPayload>
        ? IQAppMessage<TModuleDef, TType, TPayload>
        : TMessageDef extends IQAppMessageDef<infer TModuleDef, infer TType, infer TPayload>
        ? IQAppMessage<TModuleDef, TType, TPayload>
        : never
    : TMessageDef extends IQAppMessageCreator<infer TModuleDef, infer TType, infer TPayload>
    ? IQAppMessage<TModuleDef, TType, TPayload>
    : TMessageDef extends IQAppMessageDef<infer TModuleDef, infer TType, infer TPayload>
    ? IQAppMessage<TModuleDef, TType, TPayload>
    : never;

export function defineMsg<TModuleDef extends AnyQAppModuleDef, TModuleName extends ExtractQAppModuleName<TModuleDef>, TType extends string, TPayload>(
    moduleDef: TModuleDef,
    type: `${TType}`,
    payload: TPayload,
): IQAppMessageCreator<TModuleDef, `${TModuleName} ${TType}`, TPayload> {
    const finalType = (moduleDef.moduleName + ' ' + type) as `${TModuleName} ${TType}`;
    const msgCreator: IQAppMessageCreator<TModuleDef, `${TModuleName} ${TType}`, TPayload> = (payload: TPayload) => ({ type: finalType, payload });
    msgCreator.type = finalType;
    msgCreator.readOnly = () => ({
        type: finalType,
    });

    return msgCreator;
}

export const withPayload = <TPayload = {}>(): TPayload => null;

export function getDefineMsgTool<TModuleDef extends AnyQAppModuleDef>(moduleDef: TModuleDef) {
    return <TType extends string, TPayload>(type: `${TType}`, payload: TPayload) => {
        return defineMsg(moduleDef, type, payload);
    };
}
