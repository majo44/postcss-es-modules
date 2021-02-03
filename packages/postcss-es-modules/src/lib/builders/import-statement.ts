import { dirname, relative } from 'path';
import { Builder, Root } from 'postcss';
import { defaultOptions, ExtendedStylesInjectOptions } from '../options';

/**
 * Builds import statement.
 */
const buildImportStatement = (
    node: Root, builder: Builder, from: string, item: string, module: 'esm' | 'cjs' = defaultOptions.inject.moduleType) => {
    if (module === 'esm') {
        builder(`import { ${item} } from '${from}';\n`, node);
    } else if (module === 'cjs') {
        builder(`const { injectStyles } = require('${from}');\n`, node);
    }
};

/**
 * Builds import statement of injector.
 */
export const buildImportInjectStylesStatement = (
    node: Root, builder: Builder, options: ExtendedStylesInjectOptions = {}): void => {
    if (options.script === 'eject'
        && options.scriptEjectPath
        && node.source?.input.file) {
        let rel = relative(dirname(node.source.input.file), options.scriptEjectPath);
        rel = rel.replace(/\\/g, '/');
        if (!rel.startsWith('.')) {
            rel = `./${rel}`;
        }
        buildImportStatement(node, builder, `${rel}/inject-styles`, 'injectStyles', options.moduleType);
    } else {
        buildImportStatement(node, builder, 'css-es-modules', 'injectStyles', options.moduleType);
    }
};
