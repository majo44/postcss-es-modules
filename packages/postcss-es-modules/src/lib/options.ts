import { defaultStylesInjectOptions, StylesInjectOptions } from 'css-es-modules';

/**
 * Css modules processing options.
 * @public
 */
export interface ModulesOptions {
    /**
     * If you want to still use the original class name next to local one.
     * Default false.
     */
    attachOriginalClassName?: boolean;
    /**
     * By default, the plugin assumes that all the classes are local.
     * You can change this behaviour using the scopeBehaviour option.
     */
    scopeBehaviour?: 'global' | 'local';
    /**
     * To define paths for global modules, use the globalModulePaths option.
     * It is an array with regular expressions defining the paths:
     */
    globalModulePaths?: Array<string | RegExp>;
    /**
     * To generate custom classes, use the generateScopedName callback,
     * or just pass an interpolated string to the generateScopedName option:
     * `generateScopedName: "[name]__[local]___[hash:base64:5]"`
     */
    generateScopedName?: string | ((name: string, filename: string, css: string) => string);
    /**
     * It's possible to add custom hash to generate more unique classes using the hashPrefix option.
     */
    hashPrefix?: string;
    /**
     * If you need to export global names via the module object along with the local ones,
     * add the exportGlobals option.
     */
    exportGlobals?: boolean;
    /**
     * Style of exported classnames.
     */
    localsConvention?: 'camelCase' | 'camelCaseOnly' | 'dashes' |  'dashesOnly' |
        ((originalClassName: string, generatedClassName: string, inputFile: string) => string);
}

/**
 * Styles loader options.
 * @public
 */
export interface ExtendedStylesInjectOptions extends StylesInjectOptions {
    /**
     * Generated modules type.
     * Options:
     *  - 'esm': ecmascript 6 modules
     *  - 'cjs': commonjs
     *
     * Default 'esm'
     */
    moduleType?: 'esm' | 'cjs';
    /**
     * The way how the loader script will be referred from the generated source.
     * Options:
     *  - 'embed': embedding loader script in the target source
     *  - 'eject': the loader script will be ejected to the provided scriptEjectPath
     *  - 'import': the loader script will be referred by the import statement
     *
     *  Default: 'import'
     */
    script?: 'embed' | 'eject' | 'import',
    /**
     * The script type.
     * Options:
     *  - 'ts': typescript
     *  - 'js': javascript
     *
     *  Default: 'js'
     */
    scriptType?: 'ts' | 'js',
    /**
     * The path where the script code will be ejected. This option is required if 'eject'
     * value is set for the script type.
     */
    scriptEjectPath?: string,
}

/**
 * The plugin options.
 * @public
 */
export interface Options {
    /**
     * Css modules configuration.
     */
    modules?: ModulesOptions;
    /**
     * Css loader configuration.
     */
    loader?: ExtendedStylesInjectOptions;
}

/**
 * Default values of the options.
 * @internal
 */
export const defaultOptions = {
    loader: {
        ...defaultStylesInjectOptions,
        moduleType: 'esm',
        script: 'import',
        scriptType: 'js'
    },
    modules: {}
} as const;
