/* eslint-disable */
import { CSS_GLOBAL_KEY, CSS_LOCALS_KEY } from './inject-styles';

// globals declaration to avoid the typescript compile errors
declare global {
    interface Document {
        adoptedStyleSheets: CSSStyleSheet[];
    }
    namespace NodeJS {
        interface Global {
            [CSS_GLOBAL_KEY]: Record<string, string>;
            [CSS_LOCALS_KEY]: Record<string, string>;
        }
    }
    var global: NodeJS.Global & typeof globalThis;
}

/**
 * The collector object.
 * @public
 */
export interface StylesCollector {
    /**
     * Raw css string.
     */
    readonly raw: string;
    /**
     * Stylesheets ids map.
     */
    readonly ids: Record<string, true>;
    /**
     * Raw html which can be injected on ssr into the markup on the header.
     */
    readonly html: string;
}

/**
 * Start collecting of styles.
 * @public
 */
export function collectStyles(): StylesCollector {
    // prepare new collection for the locals injection
    const collection: Record<string, string> = {};
    typeof global !== 'undefined' && (global[CSS_LOCALS_KEY] = collection);

    return {
        get raw() {
            const globalsCollection = global[CSS_GLOBAL_KEY];
            let styles = '';
            // if there is some globals styles set
            if (globalsCollection) {
                styles = Object.keys(globalsCollection).reduce(
                    (r, i) => `${r}\n${globalsCollection[i]}`, styles);
            }
            return Object.keys(collection).reduce(
                (r, i) => `${r}\n${collection[i]}`, styles);
        },
        get ids() {
            const globalsCollection = global[CSS_GLOBAL_KEY];
            let ids = {};
            // if there is some globals styles set
            if (globalsCollection) {
                ids = Object.keys(globalsCollection).reduce(
                    (r, i) => ({ ...r, [i]: true }), ids);
            }
            return Object.keys(collection).reduce(
                (r, i) => ({ ...r, [i]: true }), ids);
        },
        get html() {
            return `<style>${this.raw}</style><script>window['${CSS_GLOBAL_KEY}'] = ${JSON.stringify(this.ids)}</script>`
        }
    }
}
