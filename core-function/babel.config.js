module.exports = {
    "presets": ["@babel/preset-typescript", ["@babel/preset-env", {
        // Use only for debugging (©captain obvious)
        //"debug": true,
        //Applies polyfills when they are needed (used). Use "debug": true option to see the effect
        useBuiltIns: "usage",
        //Points babel-preset-env plugin to the specific polyfills library version
        corejs: 3,
        "targets": {
            "node": 16
        }
    }]],
    "plugins": [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-optional-chaining",
        "@babel/plugin-proposal-nullish-coalescing-operator"
    ]
};
