const { postcssEsModules }  = require('postcss-es-modules');

module.exports = (ctx) => ({
    plugins: [
        postcssEsModules({
            modules: {
                attachOriginalClassName: true
            },
            inject: {
                script: "eject",
                scriptType: "ts",
                scriptEjectPath: __dirname + "/src/styles-inject"
            }
        }),
    ]
})
