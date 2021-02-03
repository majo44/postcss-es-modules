import { Builder, Root } from 'postcss';

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

    if (injectStatement === undefined) {
        injectStatement = `injectStyles(key, css${hasRuntimeOptions ? ', options' : ''});`;
    }

    builder(`const styles = {\n`, node);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        if (classMap?.[className]) {
            const resolvedClassName =
                `${classMap[className]}${attachOriginalClassName ? ` ${className}` : ''}`;
            builder(`    get ['${className}']() { ${injectStatement} `
                + ` return '${resolvedClassName}'; },\n`, node);
        }
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

    if (injectStatement === undefined) {
        injectStatement = `injectStyles(key, css${hasRuntimeOptions ? ', options' : ''});`;
    }

    builder(`const styles = {\n`, node);
    // styles class names map
    Object.keys(classMap).forEach((className) => {
        if (classMap?.[className]) {
            const resolvedClassName = `${classMap[className]}${attachOriginalClassName ? ` ${className}` : ''}`;
            builder(`    ['${className}']: '${resolvedClassName}',\n`, node);
        }
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
