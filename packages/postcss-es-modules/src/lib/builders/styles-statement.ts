import { Builder, Root } from 'postcss';

function getResolvedClassName(classMap: Record<string, string>, className: string, attachOriginalClassName: boolean) {
    return `${classMap[className]}${attachOriginalClassName ? ` ${className}` : ''}`;
}

function getInjectStatement(injectStatement: string | undefined, hasRuntimeOptions: boolean, shadowRoot: boolean) {
    if (injectStatement === undefined) {
        injectStatement = `injectStyles(key, css, ${hasRuntimeOptions ? 'options' : 'undefined'}, undefined, ${shadowRoot ? 'shadowRoot' : 'undefined'});`;
    } else {
        injectStatement += ';';
    }
    return injectStatement;
}

/**
 * Build the styles statement with lazy loading.
 */
export const buildLazyStylesStatement = (
    builder: Builder,
    node: Root,
    classMap: Record<string, string>,
    injectStatement: string | undefined,
    attachOriginalClassName: boolean,
    hasRuntimeOptions: boolean): void => {

    const injectStatement1 = getInjectStatement(injectStatement, hasRuntimeOptions, false);

    builder(`const styles = {\n`);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        builder(`    get ['${className}']() { ${injectStatement1} `
            + ` return '${getResolvedClassName(classMap, className, attachOriginalClassName)}'; },\n`);
    });

    const injectStatement2 = getInjectStatement(injectStatement, hasRuntimeOptions, true);

    // inject method
    builder(`    inject(shadowRoot) { ${injectStatement2} }\n`);
    builder(`};\n`);

};

/**
 * Build the styles statement with on demand style loading.
 */
export const buildOnDemandStylesStatement = (
    builder: Builder,
    node: Root,
    classMap: Record<string, string>,
    injectStatement: string | undefined,
    attachOriginalClassName: boolean,
    hasRuntimeOptions: boolean): void => {

    injectStatement = getInjectStatement(injectStatement, hasRuntimeOptions, true);

    builder(`const styles = {\n`);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        builder(`    ['${className}']: '${getResolvedClassName(classMap, className, attachOriginalClassName)}',\n`);
    });
    // inject method
    builder(`    inject(shadowRoot) { ${injectStatement} }\n`);
    builder(`};\n`);

};

/**
 * Build the styles statement with on instant style loading.
 */
export const buildInstantStylesStatement = (
    builder: Builder,
    node: Root,
    classMap: Record<string, string>,
    injectStatement: string | undefined,
    attachOriginalClassName: boolean,
    hasRuntimeOptions: boolean): void => {

    buildOnDemandStylesStatement(
        builder, node, classMap, injectStatement, attachOriginalClassName, hasRuntimeOptions);
    builder(`styles.inject();\n`);

};
