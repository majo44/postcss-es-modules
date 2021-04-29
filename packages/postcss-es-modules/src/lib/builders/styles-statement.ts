import { Builder, Root } from 'postcss';

function getResolvedClassName(classMap: Record<string, string>, className: string, attachOriginalClassName: boolean) {
    return `${classMap[className]}${attachOriginalClassName ? ` ${className}` : ''}`;
}

function getInjectStatement(injectStatement: string | undefined, hasRuntimeOptions: boolean) {
    if (injectStatement === undefined) {
        injectStatement = `injectStyles(key, css${hasRuntimeOptions ? ', options' : ''});`;
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

    injectStatement = getInjectStatement(injectStatement, hasRuntimeOptions);

    builder(`const styles = {\n`, node);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        builder(`    get ['${className}']() { ${injectStatement} `
            + ` return '${getResolvedClassName(classMap, className, attachOriginalClassName)}'; },\n`, node);
    });
    // inject method
    builder(`    inject() { ${injectStatement} }\n`, node);
    builder(`};\n`, node);

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

    injectStatement = getInjectStatement(injectStatement, hasRuntimeOptions);

    builder(`const styles = {\n`, node);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        builder(`    ['${className}']: '${getResolvedClassName(classMap, className, attachOriginalClassName)}',\n`, node);
    });
    // inject method
    builder(`    inject() { ${injectStatement} }\n`, node);
    builder(`};\n`, node);

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
    builder(`styles.inject();\n`, node);

};
