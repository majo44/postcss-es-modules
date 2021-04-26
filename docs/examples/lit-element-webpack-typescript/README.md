# Lit element example
Example of usage postcss-es-modules with the [lit-element](https://lit-element.polymer-project.org/) 
library, typescript and webpack.

In this example we are simply using webpack postcss-loader for loading the raw css in to the 
typescript module. Then we are referring it from the web-component. 

## running
```bash
yarn run
```

## project structure
```
├── src
│   ├── global.d.ts        // global types declaration
│   ├── index.css          // css source code
│   └── index.ts           // typescript
├── index.html             // the html index file
├── package.json           // project package.json
├── tsconfig.json          // minimal typescript config
└── webpack.config.js      // minimal webpack config
```

## ./src/index.css

[./src/index.css](./src/index.css ':include :type=code')

## ./src/global.d.ts

[./src/global.d.ts](./src/global.d.ts ':include :type=code')

## ./src/index.ts

[./src/index.ts](./src/index.ts ':include :type=code')

## ./index.html

[./index.html](./index.html ':include :type=code')

## ./package.json

[./package.json](./package.json ':include :type=code')

> Please notice the settings for the plugin. As we are using the lit-element build-in styles injection
> we are using injection mode `none`.

## ./tsconfig.json

[./tsconfig.json](./tsconfig.json ':include :type=code')

## ./webpack.config.js

[./webpack.config.js](./webpack.config.js ':include :type=code')
