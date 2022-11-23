import * as gulp from "gulp";

// GULP MODULES
import * as gulpTypescript from "gulp-typescript";
import * as gulpUglify from "gulp-uglify";
import * as gulpTypedoc from "gulp-typedoc";

// UTILS
import * as fsExtra from "fs-extra";
import * as merge2 from "merge2";
import * as path from "path";
import * as browserify from "browserify";
import * as vinylSourceStream from "vinyl-source-stream";
import * as vinylBuffer from "vinyl-buffer";
import * as chokidar from "chokidar";
import * as glob from "glob";
import * as simpleGit from "simple-git";

// VARIABLES
const packageJson = require("./package.json");
const packageData = {
    version: packageJson.version!,
    name: packageJson.name!,
    gitRepo: packageJson.repository?.url!,
};
const paths = {
    clean: [`docs/${packageData.version}`, "docs/github-wiki", "build"],
    typescript: {
        tsconfig: path.resolve("tsconfig.json"),
        entry: path.resolve("src/main.ts"),
        glob: path.resolve("src/**/*.ts"),
    },
    transpiled: {
        entry: path.resolve("build/build/main.js"),
        app: path.resolve("build/build"),
    },
    build: {
        types: path.resolve("build/types"),
        app: {
            path: path.resolve("build"),
            name: "app.js",
        },
    },
    documentation: {
        main: path.resolve("docs"),
        versionned: path.resolve("docs", packageData.version),
        forceDelete: ["README.md", "modules.md", `${packageData.version}-README.md`],
        wiki: {
            path: path.resolve("docs/github-wiki"),
        },
    },
};

/**
 * Delete build files and folders.
 * @param done Callback function
 */
function clean(done: gulp.TaskFunctionCallback) {
    paths.clean.forEach((folder) => {
        const folderPath = path.resolve(__dirname, folder);

        if (fsExtra.existsSync(folderPath)) {
            fsExtra.rmSync(folderPath, { recursive: true });
        }
    });

    done();
}

/**
 * Load TS config et perform transpilation/declaration.
 * @param done Callback function.
 * @returns Transpiled pipes.
 */
function transpile(done: gulp.TaskFunctionCallback) {
    const typescriptProject = gulpTypescript.createProject(paths.typescript.tsconfig);
    const typescriptResult = gulp.src(paths.typescript.glob).pipe(typescriptProject());

    return merge2([
        typescriptResult.js.pipe(gulp.dest(paths.transpiled.app)),
        typescriptResult.dts.pipe(gulp.dest(paths.build.types)),
    ]);
}

/**
 * Minify transpiled JS into one file and delete the original transpiled files.
 * @param done Callback function.
 */
function minify(done: gulp.TaskFunctionCallback) {
    browserify({
        entries: paths.transpiled.entry,
        debug: true,
    })
        .bundle()
        .pipe(vinylSourceStream(paths.build.app.name))
        .pipe(vinylBuffer())
        .pipe(gulpUglify())
        .pipe(gulp.dest(paths.build.app.path))
        .on("end", () => {
            fsExtra.rmSync(paths.transpiled.app, { recursive: true });
            done();
        });
}

/**
 * Create documentation.
 * Will create a `docs/x` folder where `x` is the package's version (defined in `package.json`) with TypeDoc.
 * All documentation files' link will be rewrited from `version/path/to/the/file.md` to `version/version-path-to-the-file.md` to match with Github Wiki's structure.
 * Then, it will delete all unused files (pre-compiled or unused files (.nojekyll, folders, README.md)).
 * @remarks All links to root `README.md` will be rewrited to `Home.md`, repo's Github Wiki main page.
 * @param done Callback function.
 */
function documentate(done: gulp.TaskFunctionCallback) {
    const appDisplayName = `${packageData.name} - ${packageData.version}`;

    gulp.src(paths.typescript.entry)
        .pipe(
            gulpTypedoc({
                out: paths.documentation.versionned,
                version: true,
                excludePrivate: true,
                excludeProtected: true,
                hideGenerator: true,
                gitRevision: "",
                name: appDisplayName,
            })
        )
        .on("end", () => {
            const watcher = chokidar.watch(paths.documentation.versionned, { depth: 1 });

            watcher.on("add", () => {
                watcher.close();

                glob.sync("**/*.md", {
                    absolute: true,
                    cwd: paths.documentation.versionned,
                }).forEach((markdownFilePath) => {
                    // Load each markdown file and rewrite relative links to Github-like links.
                    var markdownFileContent = fsExtra.readFileSync(markdownFilePath).toString();

                    markdownFileContent.match(/\[.+?\]\(.+?\)/g)?.forEach((markdownLink) => {
                        const linkName = markdownLink.match(/\[.*?\]/)![0].slice(1, -1);
                        const relativePath = markdownLink.match(/\(.*?\)/)![0].slice(1, -1);

                        const newLinkName = (() => {
                            switch (linkName) {
                                case appDisplayName:
                                    return packageData.name;
                                case "Exports":
                                    return packageData.version;
                                default:
                                    return linkName;
                            }
                        })();

                        console.log(linkName, relativePath, newLinkName);

                        const hasAnchor = relativePath.lastIndexOf("#") !== -1;

                        const absolutePath = path.resolve(
                            path.dirname(markdownFilePath),
                            relativePath.slice(
                                0,
                                hasAnchor ? relativePath.lastIndexOf("#") : undefined
                            )
                        );
                        const anchor = hasAnchor
                            ? relativePath.slice(relativePath.lastIndexOf("#"))
                            : "";

                        if (fsExtra.existsSync(absolutePath)) {
                            const newRelativePath = `${path
                                .relative(paths.documentation.main, absolutePath)
                                .split("/")
                                .filter((element, index) => {
                                    return index !== 1;
                                })
                                .join("-")}`;

                            const newPath = ((): string => {
                                switch (
                                    path.relative(paths.documentation.versionned, absolutePath)
                                ) {
                                    case "README.md":
                                        return "Home.md";
                                    case "modules.md":
                                        return `${packageData.version}.md`;
                                    default:
                                        return `${newRelativePath}`;
                                }
                            })();

                            const newMarkdownLink = markdownLink
                                .replace(relativePath, `${newPath}${anchor}`)
                                .replace(linkName, newLinkName);

                            markdownFileContent = markdownFileContent.replace(
                                markdownLink,
                                newMarkdownLink
                            );
                        }

                        fsExtra.writeFileSync(markdownFilePath, markdownFileContent);
                    });
                });

                // Copy each files as his new name.
                glob.sync("**/*.md", {
                    cwd: paths.documentation.versionned,
                    absolute: true,
                }).forEach((markdownFileRelativePath) => {
                    const newMarkdownFileName = ((): string => {
                        const temporaryMarkDownFileName = path
                            .relative(paths.documentation.versionned, markdownFileRelativePath)
                            .replaceAll("/", "-");
                        switch (temporaryMarkDownFileName) {
                            case "README.md":
                                return "README.md";
                            case "modules.md":
                                return `${packageData.version}.md`;
                            default:
                                return `${packageData.version}-${temporaryMarkDownFileName
                                    .split("-")
                                    .slice(1)
                                    .join("-")}`;
                        }
                    })();
                    const newMarkdownFilePath = path.resolve(
                        paths.documentation.versionned,
                        newMarkdownFileName
                    );

                    if (markdownFileRelativePath !== newMarkdownFilePath) {
                        fsExtra.copyFileSync(markdownFileRelativePath, newMarkdownFilePath);
                    }
                });

                // Clean old files
                glob.sync("./*", {
                    absolute: true,
                    cwd: paths.documentation.versionned,
                    dot: true,
                }).forEach((docFile) => {
                    if (
                        path.extname(docFile) !== ".md" ||
                        paths.documentation.forceDelete.includes(
                            path.relative(paths.documentation.versionned, docFile)
                        )
                    ) {
                        fsExtra.rmSync(docFile, { recursive: true });
                    }
                });

                done();
            });
        });
}

/**
 * Called automatically after a successed `npm publish`, will push the generated documentation to the repo's Github Wiki.
 * @throw [Error](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) if any file prefixed by the package's version (`major.minor.patch-...`) exists.
 * To publish, remove all version's documentation, then launch this task manually.
 * @param done Callback function.
 */
function publishDocumentation(done: gulp.TaskFunctionCallback) {
    if (fsExtra.existsSync(paths.documentation.wiki.path)) {
        fsExtra.rmSync(paths.documentation.wiki.path, { recursive: true });
    }

    fsExtra.mkdirSync(paths.documentation.wiki.path);

    const git = simpleGit.simpleGit(paths.documentation.wiki.path);

    git.clone(packageData.gitRepo, ".", undefined, () => {
        if (
            fsExtra.readdirSync(paths.documentation.wiki.path).filter((wikiFile) => {
                return wikiFile.startsWith(packageData.version);
            }).length !== 0
        ) {
            throw new Error(
                `Documentation for version ${packageData.version} is already on the repo's wiki. To bypass it, please remove first all '${packageData.version}-x.md' files, then run 'gulp publishDocumentation'.`
            );
        }

        const filesToCommit = glob.sync(`${packageData.version}*.md`, {
            cwd: paths.documentation.versionned,
        });

        filesToCommit.forEach((fileToCommit) => {
            fsExtra.copyFileSync(
                path.resolve(paths.documentation.versionned, fileToCommit),
                path.resolve(paths.documentation.wiki.path, fileToCommit)
            );
        });

        git.add(filesToCommit, () => {
            git.commit(
                `[GULP] Automatically generated documentation for version ${packageData.version}.`,
                () => {
                    git.addTag(`v${packageData.version}`, () => {
                        git.push(() => {
                            done();
                        });
                    });
                }
            );
        });
    });
}

gulp.task("clean", clean);

gulp.task("build", gulp.series("clean", transpile, minify));

gulp.task("documentate", gulp.series("clean", documentate));

gulp.task("publishDocumentation", gulp.series("documentate", publishDocumentation));
