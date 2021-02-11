const { postcssEsModules }  = require('postcss-es-modules');
const postCssSass = require('@csstools/postcss-sass');

module.exports = () => ({
    plugins: [
        postCssSass(),
        postcssEsModules({
            inject: {
                scriptType: 'ts',
                useConstructableStylesheet: false
            }
        }),
    ]
})
