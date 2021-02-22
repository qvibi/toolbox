import {
    AnyQvibiFrontEndModuleDef,
    ExtractQvibiFrontEndModuleName,
    ExtractQvibiFrontEndModuleState,
    IQvibiFrontEndModule,
    IQvibiFrontEndModuleDef,
} from './module';

export interface IQvibiMessage<TType, TPayload> {
    readonly type: TType;
    readonly payload: Readonly<TPayload>;
}

export interface IQvibiMessageDef<TType, _TPayload> {
    type: TType;
}

export interface IQvibiMessageCreator<TType, TPayload> extends IQvibiMessageDef<TType, TPayload> {
    (payload: TPayload): IQvibiMessage<TType, TPayload>;
    readOnly(): IQvibiMessageDef<TType, TPayload>;
}

export type AnyQvibiMessageDef = IQvibiMessageDef<string, unknown>;
export type AnyQvibiMessage = IQvibiMessage<string, unknown>;

export type ExtractQvibiMessage<TMessageDef> = TMessageDef extends Array<infer TInnerDefs>
    ? TInnerDefs extends IQvibiMessageCreator<infer TType, infer TPayload>
        ? IQvibiMessage<TType, TPayload>
        : TMessageDef extends IQvibiMessageDef<infer TType, infer TPayload>
        ? IQvibiMessage<TType, TPayload>
        : never
    : TMessageDef extends IQvibiMessageCreator<infer TType, infer TPayload>
    ? IQvibiMessage<TType, TPayload>
    : TMessageDef extends IQvibiMessageDef<infer TType, infer TPayload>
    ? IQvibiMessage<TType, TPayload>
    : never;

export function defineMsg<
    TModuleDef extends AnyQvibiFrontEndModuleDef,
    TModuleName extends ExtractQvibiFrontEndModuleName<TModuleDef>,
    TType extends string,
    TPayload
>(moduleDef: TModuleDef, type: `${TType}`, _payload: TPayload): IQvibiMessageCreator<`${TModuleName} ${TType}`, TPayload> {
    const finalType = (moduleDef.moduleName + ' ' + type) as `${TModuleName} ${TType}`;
    const msgCreator: IQvibiMessageCreator<`${TModuleName} ${TType}`, TPayload> = (payload: TPayload) => ({ type: finalType, payload });
    msgCreator.type = finalType;
    msgCreator.readOnly = () => ({
        type: finalType,
    });

    return msgCreator;
}

export const withPayload = <TPayload = Record<string, never>>(_payload?: TPayload): TPayload => null as never;
