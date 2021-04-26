# Cli typescript example
Example of usage postcss-es-modules with the postcss cli and typescript.

In this example we are simply using postcss cli to generate the javascript code, and then we
are referring it from the typescript code.

## running
```bash
yarn run
```

## project structure
```
├── src
│   ├── index.css          // css source code
│   └── index.ts           // typescript
├── package.json           // project package.json
└── tsconfig.json          // minimal typescript configuration
```

## ./src/index.css

[./src/index.css](./src/index.css ':include :type=code')

## ./src/index.ts

[./src/index.ts](./src/index.ts ':include :type=code')


## ./package.json

[./package.json](./package.json ':include :type=code')

> Please notice the settings for the plugin. As we are run this code directly under the ts-node we
> are generating the typescript modules.

## ./tsconfig.json
[./tsconfig.json](./tsconfig.json ':include :type=code')
