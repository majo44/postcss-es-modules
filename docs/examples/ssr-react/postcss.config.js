const { postcssEsModules }  = require('postcss-es-modules');

module.exports = (ctx) => ({
    plugins: [
        postcssEsModules({
            inject:  {
                moduleType: 'cjs'
            }
        }),
    ]
})
