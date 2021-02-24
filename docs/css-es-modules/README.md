# css-es-modules

Helper package which is responsible for isomorphic css styles injection.
This package is used by the [postcss-es-modules](https://github.com/majo44/postcss-es-modules)

## Overview
This package provides two functions `injectStyles` and `collectStyles`. `injectStyles` function 
is responsible for attach provided css string into the DOM on browser side, or it is storing 
the css string within the node.js globals for the server side rendering. `collectStyles` function
is responsible for collecting all used css strings within the container objects, which 
can be used for taking the styles and embed in to the server response on the server side rendering.

## Features
* Framework agnostic
* Javascript and Typescript support
* Server side rendering
* Lazy, on demand or instant styles injection

## Installation

```bash
npm i css-es-modules
```

## Usage

### Simple styles injection in to the DOM
```javascript
import { injectStyles } from 'css-es-modules';
// injecting styles to DOM
injectStyles('uniqueStylesheetKey', '.component { color: blue; }');
```
### Usage with React

#### Component code

```javascript
import { injectStyles } from 'css-es-modules';
import { useEffect,  } from 'react';

// css content
const css = '.component { color: blue; }';

/**
 * React Component.
 */
export const Component = () => {
    // you can call injectStyles multiple times, for same key it will inject the styles once 
    injectStyles('uniqueStylesheetKey', css);
    return <div className="component">Component</div>
}
```

#### Server side rendering

```javascript
import express from 'express';
import { collectStyles } from 'css-es-modules';
import { renderToString } from 'react-dom/server';
import { Component } from '...';

// Express application
const app = express();

/**
 * App html template
 * @param styles - the StylesCollector object
 * @param html - prerendered app markup
 */
const template = (styles, html) => `
    <html lang="en">
        <head>${ styles.html }</head>
        <body><div id="app">${ html }</div></body>
    </html>`;

// handling request
app.use((req, res) => {
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
```
## Options
The injectStyles function is taking third optional parameter which is an object with fallowing 
properties:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `useNounce` | `string` | - | The style nounce key |
| `useConstructableStylesheet` | `boolean` | true | Use Constructable Stylesheet for styles injection to DOM if the browser supports Constructable Stylesheet |
| `useStyleTag` | `boolean` | true | Use \<style\> tag for styles injection to DOM |
| `useNodeGlobal` | `boolean` | true | Enable node.js global for collecting the styles, required for server side rendering |
