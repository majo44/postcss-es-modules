# Cli example 
Example of usage postcss-es-modules with the postcss cli.

In this example we are simply using postcss cli to generate the javascript code, and then we 
are referring it from the javascript code. 

## running
```bash
yarn run
```

## project structure
```
├── src
│   ├── index.css          // css source code
│   └── index.js           // javascript
└── package.json           // project package.json
```

## ./src/index.css
Css source code.

[./src/index.css](./src/index.css ':include :type=code')

## ./src/index.js
Javascript.

[./src/index.js](./src/index.js ':include :type=code')

## ./package.json
Project package.json

[./package.json](./package.json ':include :type=code')

> Please notice the settings for the plugin. As we are run this code directly under the node we 
> are generating the common js modules.

> Please notice the node -r option. As we are imports css files we are using here postcss-node, which 
> provides easy way of importing the css files within the node.js.
