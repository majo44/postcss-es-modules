# postcss-node

Package which allows import of css files under the node.js eg `require('styles.css')`
This package should be used together with [postcss-es-modules](https://github.com/majo44/postcss-es-modules)

## Overview
By using `require.extensions` this package register the handlers which on the fly, on runtime,
for each `.css` file require is transpiling the css content by using [postcss](https://postcss.org/). 
To be able to load the `.css` file as javascript module, you should use
[postcss-es-modules](https://github.com/majo44/postcss-es-modules) post css plugin.

## Installation

```bash
npm i postcss-node postcss-es-modules
```

## Usage

Firstly we need to provide the proper postcss configuration, you can add it to your package.json, or 
keep it in separate file eg:
```javascript
/* postcss.config.js */
module.exports = {
    "plugins": {
        // this plugin will transform css into the js module
        "postcss-es-modules": {
            "inject": {
                // we will use the common js modules
                "moduleType": "cjs"
            }
        }
    }
}
```

### Usage on the cli
You can register the `.css/.sass` files handle just by the `-r` node.js option.  
```bash
node -r postcss-node/register test.js
```
```javascript
/* test.js */
const { styles, css } = require('./test.css');
console.log(css);
console.log(styles.a);
```
```css
/* test.css */
.a {
    color: blue;
} 
```

### Usage within the code
Or you can register the handle manually within the code.

```bash
node test.js
```
```javascript
/* test.js */
const { register } = require('postcss-node');
register();
const { styles, css } = require('./test.css');
console.log(css);
console.log(styles.a);
```
```css
/* test.css */
.a {
    color: blue;
} 
```

### Custom files extensions
The `register` function is able to take the optional parameter, which will be the array of the 
file extensions which should be handled by that package. By default, `register` is 
attaching handlers for the '.css', '.scss', '.sass', '.less', '.stylus'.
```bash
node test.js
```
```javascript
/* test.js */
const { register } = require('postcss-node');
register(['.acss', '.bcss', '.css']);
const { styles, css } = require('./test.acss');
console.log(css);
console.log(styles.a);
```
```css
/* test.acss */
.a {
    color: blue;
} 
```
> You can also provide the custom extensions by the `POSTCSS_NODE_EXT` environment variable like: 
> `cross-env POSTCSS_NODE_EXT=.acss,.bcss,.css`

### Other options
The `register` function is able to take the two more optional parameter
* timeout (`POSTCSS_NODE_TIMEOUT`) - the timeout of css processing, default 60000 ms
* bufferSize (`POSTCSS_NODE_BUFFER_SIZE`) - the size of buffer used to transfer compiled code from 
  the worker, in case of `RangeError [ERR_BUFFER_OUT_OF_BOUNDS]: "length" is outside of buffer bounds`
  error please increase this parameter, default 1024 kB   

## Need a help ?
If you have any problems, issues, ect. please use [github discussions](https://github.com/majo44/postcss-es-modules/discussions). 
