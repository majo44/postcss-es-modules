const express = require('express');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { collectStyles } = require('css-es-modules');
// imports the transformed css file
const { styles } = require('./index.module.css.js');

const app = express();

// example component to render
const App = () => createElement('div', { className: styles.app}, "Hello Word");

/**
 * App template
 * @param styles - the StylesCollector object
 * @param html - prerendered app markup
 */
const template = (styles, html) => `
    <html lang="en">
        <head>${styles.html}</head>
        <body><div id="app">${ html }</div></body>
    </html>`;

// handling request
app.get('/', (req, res) => {
    res.send(
        // render template
        template(
            // firstly start collecting styles
            collectStyles(),
            // then render application
            renderToString(createElement(App))));
});

// starting app
app.listen(3000);
