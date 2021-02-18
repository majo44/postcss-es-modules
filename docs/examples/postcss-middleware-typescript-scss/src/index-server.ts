import express, {Response} from 'express';
import { typescriptCompileMiddleware } from 'express-typescript-compile';
import * as http from 'http';
import { postcssEsModules } from 'postcss-es-modules';
import postcssMiddleware from 'postcss-middleware';
// @ts-ignore
import postcssSass from '@csstools/postcss-sass';

// create app
const app = express();

// dev - on the fly compilation
app.use(typescriptCompileMiddleware());

// dev - hacky way for changing Content-Type of sass files,
// as the postcss-middleware is always set css/text
app.use('*.scss', (req, res: Response, next) => {
    const writeHead = res.writeHead;
    res.writeHead = (code: number) =>
        writeHead.call(res, code, { 'Content-Type': 'application/javascript' });
    next();
});

// dev - on the fly sass compilation
app.use('*.scss', postcssMiddleware({
    // resolving requested sass files
    src: (req) => process.cwd() + req.baseUrl,
    plugins: [
        // sass -> css
        postcssSass(),
        // css -> js
        // we will embed the styles loader
        postcssEsModules({ inject: { script: 'embed'} }),
    ]
}))

// index.html
app.get('/', (req, res) => res.sendFile(process.cwd() + '/index.html'));

// server start, exporting server for the test
export const server: http.Server = app.listen(3001, () => console.log('http://localhost:3001'));