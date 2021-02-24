import { defaultPostCssNodeExtensions } from './options';
import { CompilableModule, CssRenderSyncFn } from './types';
import { workerSyncFunction } from './worker-sync-function';

/**
 * Register the css files handle for node.js
 * @public
 * @param extensions - list of extensions, by default '.css', '.scss', '.sass', '.less', '.stylus'
 */
export function register(extensions: Array<string> = defaultPostCssNodeExtensions): void {
    let renderCssFile: CssRenderSyncFn;
    const jsHandle = require.extensions['.js'];
    const cssHandle = ((module: CompilableModule, filename: string) => {
        const orgCompile = module._compile
        module._compile = function (code: string, fileName: string) {
            if (!renderCssFile) {
                renderCssFile = workerSyncFunction(__dirname + '/worker.js');
            }
            const css = renderCssFile({ code, filename });
            return orgCompile.call(this, css, fileName)
        };

        return jsHandle(module, filename);
    }) as any;
    extensions.forEach(ext => require.extensions[ext] = cssHandle);
}
