import { readFileSync } from 'fs';
import { join } from 'path';
import { ExtendedStylesInjectOptions } from '../options';

/**
 * Reading the source of injector.
 * @param scriptType - type of required script
 * @param moduleType - type of required modules types
 */
export const readCodeForEmbed = (
    scriptType: ExtendedStylesInjectOptions['scriptType'],
    moduleType: ExtendedStylesInjectOptions['moduleType']): string => {
    const codeBasePath = require.resolve('css-es-modules');
    const codePath = scriptType === 'ts'
        ? join(codeBasePath, '../../../src/inject-styles.ts')
        : moduleType === 'esm'
            ? join(codeBasePath, '../../dist-esm/inject-styles.js')
            : join(codeBasePath, '../../dist-cjs/inject-styles.js');
    const code = readFileSync(codePath).toString('utf-8');
    return `${code}\n`;
};
