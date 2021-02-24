module.exports = process.env.TEST_ERROR_CASE
    ? {
        "plugins": {
            "xyz": 1
        }
    }
    : {
        "plugins": {
            "postcss-es-modules": {
                "inject": {
                    "moduleType": "cjs"
                }
            }
        }
    };
