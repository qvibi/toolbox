import { AnyQAppModuleDef, ExtractQAppModuleName } from './module';

export interface IQAppMessage<TType, TPayload> {
    readonly type: TType;
    readonly payload: Readonly<TPayload>;
}

export interface IQAppMessageDef<TType, _TPayload> {
    type: TType;
}

export interface IQAppMessageCreator<TType, TPayload> extends IQAppMessageDef<TType, TPayload> {
    (payload: TPayload): IQAppMessage<TType, TPayload>;
    readOnly(): IQAppMessageDef<TType, TPayload>;
}

export type AnyQAppMessageDef = IQAppMessageDef<string, unknown>;
export type AnyQAppMessage = IQAppMessage<string, unknown>;

export type ExtractQAppMessage<TMessageDef> = TMessageDef extends Array<infer TInnerDefs>
    ? TInnerDefs extends IQAppMessageCreator<infer TType, infer TPayload>
        ? IQAppMessage<TType, TPayload>
        : TMessageDef extends IQAppMessageDef<infer TType, infer TPayload>
        ? IQAppMessage<TType, TPayload>
        : never
    : TMessageDef extends IQAppMessageCreator<infer TType, infer TPayload>
    ? IQAppMessage<TType, TPayload>
    : TMessageDef extends IQAppMessageDef<infer TType, infer TPayload>
    ? IQAppMessage<TType, TPayload>
    : never;

function defineMsg<
    TModuleDef extends AnyQAppModuleDef,
    TModuleName extends ExtractQAppModuleName<TModuleDef>,
    TType extends string,
    TPayload
>(moduleDef: TModuleDef, type: `${TType}`, _payload: TPayload): IQAppMessageCreator<`${TModuleName} ${TType}`, TPayload> {
    const finalType = (moduleDef.moduleName + ' ' + type) as `${TModuleName} ${TType}`;
    const msgCreator: IQAppMessageCreator<`${TModuleName} ${TType}`, TPayload> = (payload: TPayload) => ({ type: finalType, payload });
    msgCreator.type = finalType;
    msgCreator.readOnly = () => ({
        type: finalType,
    });

    return msgCreator;
}

export const withPayload = <TPayload = Record<string, never>>(_payload?: TPayload): TPayload => null as never;

export function defineMsgs<TModuleDef extends AnyQAppModuleDef, TModuleName extends ExtractQAppModuleName<TModuleDef>>(
    moduleDef: TModuleDef,
): <TType extends string, TPayload>(type: `${TType}`, _payload: TPayload) => IQAppMessageCreator<`${TModuleName} ${TType}`, TPayload> {
    return (type, payload) => {
        return defineMsg(moduleDef, type, payload);
    };
}
