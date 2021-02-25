import { generatePath as generatePathInternal, ExtractRouteParams as ExtractRouteParamsFromPath } from 'react-router';

export interface IQAppRouteDefOptions<TPath extends string> {
    path: `${TPath}`;
}

export type IQAppRouteParams = Record<string, string | number | boolean>;

export interface IQAppRouteDef<TPath extends string, _TParams extends IQAppRouteParams = Record<string, never>> {
    path: `${TPath}`;
}

export type ExtractRouteParams<TRouteDef> = TRouteDef extends IQAppRouteDef<any, infer TParams> ? TParams : never;

export function defineRoute<TPath extends string>(
    options: IQAppRouteDefOptions<TPath>,
    // _params: ExtractRouteParams<TPath>,
): IQAppRouteDef<TPath, ExtractRouteParamsFromPath<TPath>> {
    return {
        path: options.path,
    };
}

export function generatePath<TRouteDef extends IQAppRouteDef<any, any>>(routeDef: TRouteDef, params: ExtractRouteParams<TRouteDef>): string {
    return generatePathInternal(routeDef.path, params);
}
