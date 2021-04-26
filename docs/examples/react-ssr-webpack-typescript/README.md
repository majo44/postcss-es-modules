# React example
Example of usage postcss-es-modules with the React library, typescript and webpack.

This is example of small application with the server and client side rendering. 
In this example we have two components, we can prerender both or the single component 
on server side, and we are sure that only referred styles are prerendered on server side.
We can also run the second component on client side, and then the component will 
inject own styles it to the DOM.

This example is using webpack and typescript.

## running
```bash
yarn run
```

## project structure
```
├── src
│   ├── app                         // isomorphic application code
│   │   ├── components              // ui components
│   │   │   ├── a.component.css     // styles of component A 
│   │   │   ├── a.component.tsx     // component A
│   │   │   ├── b.component.css     // styles of component B
│   │   │   └── b.component.tsx     // component B
│   │   └── app.component.tsx       // application component
│   ├── global.d.ts                 // global types declaration
│   ├── index.scss                  // scss source code
│   ├── index-client.ts             // client side entry point
│   └── index-server.ts             // server side entry point
├── package.json                    // project package.json
├── tsconfig.json                   // minimal typescript config
└── webpack.config.js               // minimal webpack config
```

## ./src/app/components/a.component.css

[./src/app/components/a.component.css](./src/app/components/a.component.css ':include :type=code')

## ./src/app/components/a.component.tsx

[./src/app/components/a.component.tsx](./src/app/components/a.component.tsx ':include :type=code')

## ./src/app/components/b.component.css

[./src/app/components/b.component.css](./src/app/components/b.component.css ':include :type=code')

## ./src/app/components/b.component.tsx

[./src/app/components/b.component.tsx](./src/app/components/b.component.tsx ':include :type=code')

## ./src/app/app.component.tsx

[./src/app/app.component.tsx](./src/app/app.component.tsx ':include :type=code')

## ./src/global.d.ts

[./src/global.d.ts ](./src/global.d.ts  ':include :type=code')


## ./src/index-client.tsx

[./src/index-client.tsx](./src/index-client.tsx ':include :type=code')

## ./src/index-server.tsx

[./src/index-server.tsx](./src/index-server.tsx ':include :type=code')



## ./package.json

[./package.json](./package.json ':include :type=code')

> Please notice the settings for the plugin. As we are using the lit-element build-in styles injection
> we are using injection mode `none`.

## ./tsconfig.json

[./tsconfig.json](./tsconfig.json ':include :type=code')

## ./webpack.config.js

[./webpack.config.js](./webpack.config.js ':include :type=code')
