import * as webpack from "webpack";

import * as path from "path";
import * as fsExtra from "fs-extra";
import * as packageJson from "./package.json";

module.exports = (): webpack.Configuration => {
    foldersToClean.forEach((folderToClean) => {
        if (fsExtra.existsSync(folderToClean)) {
            fsExtra.rmSync(folderToClean, { recursive: true });
        }
    });

    return {
        entry: paths.source.entry,
        output: {
            path: paths.build.js.path,
            filename: paths.build.js.name,
            library: packageData.name.package,
            libraryTarget: "umd",
            globalObject: "this",
        },
        mode: "production",
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "ts-loader",
                        options: {
                            compilerOptions: {
                                rootDir: path.resolve("src"),
                            },
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts"],
        },
    };
};

/**
 * Project metadata.
 */
const packageData = {
    version: packageJson.version!,
};
/**
 * Project's paths.
 */
const paths = {
    source: {
        entry: path.resolve("src/main.ts"),
    },
    build: {
        js: {
            path: path.resolve("app"),
            name: "app.js",
        },
    },
};
/**
 * List of folders to delete before tasks' launch.
 */
const foldersToClean = [paths.build.js.path].map((folderToClean) => {
    return path.resolve(folderToClean);
});
