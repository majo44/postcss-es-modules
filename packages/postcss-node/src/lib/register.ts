import { env } from 'process';
import { defaultPostCssNodeExtensions, defaultResponseTimeout, defaultBufferSize } from './options';
import { CompilableModule, CssRenderSyncFn } from './types';
import { workerSyncFunction } from './worker-sync-function';


/**
 * Register the css files handle for node.js
 * @public
 * @param extensions - list of extensions, by default '.css', '.scss', '.sass', '.less', '.stylus'
 * @param timeout - the timeout of processing
 * @param bufferSize - the data buffer size
 */
export function register(
    extensions: Array<string> = env.POSTCSS_NODE_EXT?.split(',') || defaultPostCssNodeExtensions,
    timeout: number = env.POSTCSS_NODE_TIMEOUT ? parseInt(env.POSTCSS_NODE_TIMEOUT) : defaultResponseTimeout,
    bufferSize: number = env.POSTCSS_NODE_BUFFER_SIZE ? parseInt(env.POSTCSS_NODE_BUFFER_SIZE) : defaultBufferSize): void {
    let renderCssFile: CssRenderSyncFn;
    const jsHandle = require.extensions['.js'];
    const cssHandle = ((module: CompilableModule, filename: string) => {
        const orgCompile = module._compile
        module._compile = function (code: string, fileName: string) {
            if (!renderCssFile) {
                renderCssFile = workerSyncFunction(__dirname + '/worker.js', timeout, bufferSize);
            }
            const { css , ex } = renderCssFile({ code, filename });
            /* istanbul ignore else */
            if (css) {
                return orgCompile.call(this, css, fileName)
            } else {
                throw ex;
            }
        };
        return jsHandle(module, filename);
    }) as any;
    extensions.forEach(ext => require.extensions[ext] = cssHandle);
}
