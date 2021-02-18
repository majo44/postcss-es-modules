import { LitElement, html, css } from 'lit-element';
// importing raw css styles, and css class names map
import { css as rawCss, styles } from './index.css';

// simple web component
class MyElement extends LitElement {
    static get styles() {
        // we will use lit-element css factory, where we will deliver the raw css stirng
        return css([rawCss] as any);
    }
    render() {
        // rendering with usage of class names
        return html`<div class=${styles.app}>
            Hello word
        </div>`;
    }
}

// define web-component within the document
customElements.define('my-element', MyElement);

// render the component within body
document.body.innerHTML = '<my-element/>';
