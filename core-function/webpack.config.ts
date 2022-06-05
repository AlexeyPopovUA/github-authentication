import {CleanWebpackPlugin} from "clean-webpack-plugin";
import {resolve} from "path";

export default (env: { prod: any; watch: any; }) => {
    console.log('env', env);
    const mode = env.prod ? "production" : "development";
    const watch = env.watch;

    return {
        //stats: 'verbose',
        target: "node",
        externals: ["aws-sdk"],
        mode,
        devtool: "source-map",
        watch,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000,
            ignored: /node_modules/
        },
        resolve: {
            extensions: [".js", ".mjs", ".ts", ".json"]
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)$/,
                    include: resolve("src"),
                    exclude: /(node_modules)/,
                    use: [{
                        loader: "babel-loader",
                        options: {
                            configFile: resolve("babel.config.js")
                        }
                    }]
                }
            ]
        },

        entry: {
            function: resolve(`./src/function.ts`)
        },

        output: {
            filename: `function.js`,
            libraryTarget: "commonjs2",
            path: resolve("dist")
        },

        plugins: [
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [`function.*`],
                dangerouslyAllowCleanPatternsOutsideProject: true,
                dry: false
            })
        ]
    };
}
