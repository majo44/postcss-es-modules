import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import { runAsWorker } from './thread';

const { plugins, options } = postcssrc.sync({});

runAsWorker(
    async (
        { code, filename }:
            { code: string, filename: string }) => {
        try {
            const result = await postcss(plugins).process(code, {
                ...options,
                from: filename
            });
            return { css: result.css };
        } catch (ex) {
            return { ex }
        }
    });
