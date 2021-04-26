import express from 'express';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { collectStyles, StylesCollector } from 'css-es-modules';
import { App } from './app/app.component';

/**
 * The template of page.
 * @param showBComponent - state of the application
 * @param styles - collected styles
 * @param html - the rendered html
 */
const template = (showBComponent: boolean, styles: StylesCollector, html: string) => `
    <html lang="en">
        <head>
            ${styles.html}
            <script>
                window.showBComponent = ${JSON.stringify(showBComponent)};
            </script>   
        </head>
        <body>
            <div id="app">${ html }</div>
            <script src="index-client.js"></script>
        </body>
    </html>`;

// prepare app
const app = express();

// handle request for the root
app.get('/', (req, res) => {
    // taking the state from the url
    const showBComponent = !!req.query['showBComponent'];
    // sending the prerendered app
    res.send(
        template(
            showBComponent,
            // firstly start collecting styles
            collectStyles(),
            // then render application
            renderToString(<App showBComponent={showBComponent}/>)));
});

// statics
app.use('/', express.static(__dirname));

// running app and expose server for testing
export const server = app.listen(3001, () => console.log('http://localhost:3001'));
