/* eslint-disable */

// globals declaration to avoid the typescript compile errors
declare global {
    interface CSSStyleSheet {
        replace(text: string): Promise<CSSStyleSheet>;
        replaceSync(text: string): void;
    }
    interface Document {
        adoptedStyleSheets: CSSStyleSheet[];
    }
    namespace NodeJS {
        interface Global {
            [CSS_GLOBAL_KEY]: Record<string, string>;
            [CSS_LOCALS_KEY]: Record<string, string>;
        }
    }
    interface Window {
        [CSS_GLOBAL_KEY]: Record<string, true>
    }
    var global: NodeJS.Global & typeof globalThis;
}

/**
 * Is node.js current env.
 */
const isNode = typeof global === 'object' && (typeof window === 'undefined' ||
    /* istanbul ignore next */
    global !== window as any);

/**
 * Global styles shared context property name.
 * @public
 */
export const CSS_GLOBAL_KEY = '$CSS$IN$JS$GLOBALS$';
/**
 * Local styles shared context property name.
 * @public
 */
export const CSS_LOCALS_KEY = '$CSS$IN$JS$LOCALS$';

/**
 * Inject options.
 * @public
 */
export interface StylesInjectOptions {
    /**
     * The style nounce key.
     */
    useNounce?: string;
    /**
     * Use Constructable Stylesheet method of the styles injection to DOM if the browser supports
     * Constructable Stylesheet.
     * Default true.
     */
    useConstructableStylesheet?: boolean;
    /**
     * Enable style tag method of the styles injection to the document.
     * If the useConstructableStylesheet is enabled, this method will ba fallback if browser is not
     * supports Constructable Stylesheets.
     * Default true.
     */
    useStyleTag?: boolean;
    /**
     * Enable node.js global method of injection.
     * Default true.
     */
    useNodeGlobal?: boolean;
}

/**
 * Default options values.
 * @public
 */
export const defaultStylesInjectOptions: StylesInjectOptions = {
    useConstructableStylesheet: true,
    useNodeGlobal: true,
    useStyleTag: true,
}

/**
 * Inject stylesheet to global on node or to the document DOM on the browser
 * @public
 * @param stylesheetKey - the unique stylesheet key
 * @param stylesheetBody - the stylesheet body
 * @param options - inject options
 * @param serverSide - force server/client approach
 */
export function injectStyles(
    stylesheetKey: string,
    stylesheetBody: string,
    options?: StylesInjectOptions,
    serverSide: boolean = isNode
): void {
    // prepare options
    const { useNodeGlobal, useConstructableStylesheet, useStyleTag, useNounce } = {
        ...defaultStylesInjectOptions,
        ...options
    }
    // if we are on the node.js
    // and node side injection is enabled
    // and style is not already registered globally
    if (serverSide && useNodeGlobal && !global[CSS_GLOBAL_KEY]?.[stylesheetKey]) {
        if (global[CSS_LOCALS_KEY]) {
            if(!global[CSS_LOCALS_KEY][stylesheetKey]) {
                // if there is a local css registry
                // injecting to locals registry
                global[CSS_LOCALS_KEY][stylesheetKey] = stylesheetBody;
            }
        } else {
            // if there is no local css registry and style is not already injected globally
            // injecting to global registry
            global[CSS_GLOBAL_KEY]  = {
                ...global[CSS_GLOBAL_KEY], [stylesheetKey]: stylesheetBody
            }
        }
        return;
    }
    // if we are on the browser side
    // and style is not already registered
    // and client side injection is enabled
    if (!serverSide
        && !window[CSS_GLOBAL_KEY]?.[stylesheetKey]
        && (useConstructableStylesheet || useStyleTag)) {
        // marking style as injected
        window[CSS_GLOBAL_KEY] = {
            ...window[CSS_GLOBAL_KEY],
            [stylesheetKey]: true
        }
        // if constructable stylesheet flag is enabled and available
        if (useConstructableStylesheet && document.adoptedStyleSheets) {
            // we are using constructable stylesheet injection method
            const stylesheet = new CSSStyleSheet();
            stylesheet.replace(stylesheetBody);
            document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet];
            return;
        }
        // if style tag flag is enabled
        if (useStyleTag) {
            // we are injecting stylesheet by styles tag
            const styleElement: HTMLStyleElement = document.createElement('style');
            useNounce && styleElement.setAttribute('nounce', useNounce);
            /* istanbul ignore if */
            if ((styleElement as any).styleSheet) {
                (styleElement as any).styleSheet.cssText += stylesheetBody
            } else {
                styleElement.textContent += stylesheetBody;
            }
            (document.head ||
                /* istanbul ignore next */
                document.getElementsByTagName('head')).appendChild(styleElement);
        }
    }
}
