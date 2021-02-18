# Postcss middleware example
Example of usage postcss-es-modules with the [postcss-middleware](https://github.com/jedmao/postcss-middleware#readme/) 
library, typescript and sass.

This is some example of usage of postcss-es-modules in a runtime mode, without need of time ahead 
compilation. Here we are using [express-typescript-compile](https://github.com/majo44/express-typescript-compile)
which compiles the typescript code on the fly.   

## running
```bash
yarn run
```

## project structure
```
├── src
│   ├── global.d.ts        // global types declaration
│   ├── index.scss         // scss source code
│   ├── index-client.ts    // client side entry point
│   └── index-server.ts    // server side entry point
├── index.html             // the html index file
├── package.json           // project package.json
└── tsconfig.json          // minimal typescript config
```

## ./src/global.d.ts

[./src/global.d.ts ](./src/global.d.ts  ':include :type=code')


## ./src/index.scss

[./src/index.scss  ](./src/index.scss  ':include :type=code')

## ./src/index-client.ts

[./src/index-client.ts](./src/index-client.ts ':include :type=code')

## ./src/index-server.ts

[./src/index-server.ts](./src/index-server.ts ':include :type=code')

> Please notice the settings for the plugin.

## ./index.html

[./index.html](./index.html ':include :type=code')

## ./package.json

[./package.json](./package.json ':include :type=code')


## ./tsconfig.json

[./index.html](./tsconfig.json  ':include :type=code')
