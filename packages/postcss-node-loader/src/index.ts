import postcss from "postcss";
import postcssrc from 'postcss-load-config';
import { env } from 'process';

type TransformSourceFn = (
    originalSource: { toStrong(): string },
    context: { url: string },
    defaultTransformSource: TransformSourceFn
) => Promise<{ source: string }>;

type GetFormatFn = (
    url: string,
    context: { url: string },
    defaultGetFormat: GetFormatFn
) => { format: string }

const defaultPostCssNodeExtensions = ['.css', '.scss', '.sass', '.less', '.stylus'];
const extensions: Array<string> = env.POSTCSS_NODE_EXT?.split(',') || defaultPostCssNodeExtensions;
let processOptions: ReturnType<typeof postcssrc.sync>['options'];
let processor: ReturnType<typeof postcss>;

const useLoader = (url: string) => {
    return extensions.findIndex(ext => url.endsWith(ext)) > 0;
}

export const transformSource: TransformSourceFn = async (
    originalSource,
    context,
    defaultTransformSource
) => {
    if (useLoader(context.url)) {

        const from = context.url.startsWith('file:///') ? context.url.substring(8) : context.url

        if (!processor) {
            const { plugins, options } = await postcssrc({});
            processOptions = options;
            processor = postcss(plugins);
        }

        try {
            const result = await processor.process(originalSource.toString(), {
                ...(processOptions as any),
                from
            });
            return {
                source: result.css
            }
        } catch (err) {
            console.error("postcss-node-loader: PostCSS compilation error");
            console.error(err);
            throw err;
        }
    }

    return defaultTransformSource(
        originalSource,
        context,
        defaultTransformSource
    );
}

export const getFormat: GetFormatFn = (url, context, defaultGetFormat) => {
    if (useLoader(url)) {
        return {
            format: "module",
        };
    } else {
        return defaultGetFormat(url, context, defaultGetFormat);
    }
}

