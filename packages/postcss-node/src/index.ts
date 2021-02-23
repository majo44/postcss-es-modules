import { createSyncFn } from './thread';
import * as Module from 'module';

type CssRenderFn = (data: { code: string, filename: string }) => { css: string, ex?: any };
type CompilableModule = Module & { _compile: (code: string, fileName: string) => string };

export const defaultPostCssNodeExtensions = ['.css', '.scss', '.sass', '.less', '.stylus'];

/**
 * Register the css files handle for node.js
 * @public
 * @param extensions - list of extensions, by default '.css', '.scss', '.sass', '.less', '.stylus'
 */
export function register(extensions: Array<string> = defaultPostCssNodeExtensions): void {
    let renderCssFile: CssRenderFn;
    const jsHandle = require.extensions['.js'];
    const cssHandle = ((module: CompilableModule, filename: string) => {
        const orgCompile = module._compile
        module._compile = function (code: string, fileName: string) {
            if (!renderCssFile) {
                renderCssFile = createSyncFn(__filename);
            }
            const { css, ex } = renderCssFile({ code, filename });
            if (ex) {
                throw ex;
            }
            return orgCompile.call(this, css, fileName)
        };

        return jsHandle(module, filename);
    }) as any;
    extensions.forEach(ext => require.extensions[ext] = cssHandle);
}
