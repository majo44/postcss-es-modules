import * as Module from 'module';

/**
 * @internal
 */
export type CssRenderSyncFn =
    (data: { code: string, filename: string }) => { css: string, ex: any };

/**
 * @internal
 */
export type CssRenderFn =
    (data: Parameters<CssRenderSyncFn>[0]) => Promise<ReturnType<CssRenderSyncFn>>;

/**
 * @internal
 */
export type CompilableModule =
    Module & { _compile: (code: string, fileName: string) => string };
