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
     * Generated code modules type.
     * Options:
     *  - 'esm' - ecmascript 6 modules
     *  - 'cjs' - commonjs
     *
     * Default 'esm'
     */
    moduleType?: 'esm' | 'cjs';
    /**
     * The mode of the styles injection.
     * Options:
     *  - `lazy` - the stylesheet will be injected on the first use of the style class name within the code
     *  - `ondemand` - the stylesheet will be injected only when the `styles.inject()` method will be called
     *  - `instant` -  the stylesheet will be injected on the module load
     *  - `none` -  the stylesheet will be never injected, to inject it to the DOM you will need to import css content
     * Default: 'lazy'
     */
    injectMode?: 'lazy' | 'ondemand' | 'instant' | 'none';
    /**
     * The way how the styles injector script will be referred from the generated source.
     * Options:
     *  - `embed`: embedding loader script in the target source
     *  - `eject`: the loader script will be ejected to the provided scriptEjectPath
     *  - `import`: the loader script will be referred by the import statement
     *
     *  Default: 'import'
     */
    script?: 'embed' | 'eject' | 'import',
    /**
     * The script type.
     * Options:
     *  - `ts`: typescript
     *  - `js`: javascript
     *
     *  Default: 'js'
     */
    scriptType?: 'ts' | 'js',
    /**
     * The path where the script code will be ejected. This option is required if 'eject'
     * value is set for the script type.
     */
    scriptEjectPath?: string,
    /**
     * Custom injection script. Use this property to use custom styles to DOM/Node injection.
     */
    custom?: {
        /**
         * The statement for import required dependencies.
         * Eg: "import  injectMyStyles  from 'somelib';
         */
        importStatement: string;
        /**
         * The statement for executing the injection.
         * There are available two constants in the context:
         * - css - the raw css code
         * - key - unique key of the stylesheet
         * Eg: "injectMyStyles(css)"
         */
        injectStatement: string;
    }
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
     * Css injection configuration.
     */
    inject?: ExtendedStylesInjectOptions;
}

/**
 * Default values of the options.
 * @internal
 */
export const defaultOptions = {
    inject: {
        ...defaultStylesInjectOptions,
        moduleType: 'esm',
        script: 'import',
        scriptType: 'js',
        injectMode: 'lazy',
    },
    modules: {}
} as const;
