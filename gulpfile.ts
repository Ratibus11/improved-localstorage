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
// import * as chokidar from "chokidar"; Unexpected behaviour on Github Actions: chokidar isn't triggering documentation's creation.
import * as glob from "glob";
import * as simpleGit from "simple-git";
import * as XMLHttpRequest from "xmlhttprequest-ts";
import * as ChildProcess from "child_process";

// VARIABLES
const gitRepoUrl = "https://github.com/ratibus11/improved-localstorage.git";
const documentationDetectionTries = 10;
const packageJson = require("./package.json");
const packageData = {
    version: packageJson.version!,
    name: packageJson.name!,
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
        wiki: path.resolve("docs/.github-wiki"),
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
function generateDocumentation(done: gulp.TaskFunctionCallback) {
    const appDisplayName = `${packageData.name} - ${packageData.version}`;

    gulp.src(paths.typescript.entry).pipe(
        gulpTypedoc({
            out: paths.documentation.versionned,
            version: true,
            excludePrivate: true,
            excludeProtected: true,
            hideGenerator: true,
            gitRevision: "",
            name: appDisplayName,
        })
    );

    var currentTries = 0;
    const interval = setInterval(() => {
        if (currentTries < documentationDetectionTries) {
            currentTries++;
            console.info(
                `Try ${currentTries}/${documentationDetectionTries} to detect documentation folder...`
            );
        } else if (currentTries === documentationDetectionTries) {
            clearInterval(interval);
            throw Error("Unable to detect documentation folder.");
        }

        if (fsExtra.existsSync(paths.documentation.versionned)) {
            clearInterval(interval);
            console.info(
                `Documentation folder for version ${packageData.version} detected. Processing...`
            );
            documentationCreated();
        }
    }, 1000);

    const documentationCreated = () => {
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

                const hasAnchor = relativePath.lastIndexOf("#") !== -1;

                const absolutePath = path.resolve(
                    path.dirname(markdownFilePath),
                    relativePath.slice(0, hasAnchor ? relativePath.lastIndexOf("#") : undefined)
                );
                const anchor = hasAnchor ? relativePath.slice(relativePath.lastIndexOf("#")) : "";

                if (fsExtra.existsSync(absolutePath)) {
                    const newRelativePath = `${path
                        .relative(paths.documentation.main, absolutePath)
                        .split("/")
                        .filter((element, index) => {
                            return index !== 1;
                        })
                        .join("-")}`;

                    const newPath = ((): string => {
                        switch (path.relative(paths.documentation.versionned, absolutePath)) {
                            case "README.md":
                                return "Home";
                            case "modules.md":
                                return `${packageData.version}`;
                            default:
                                return newRelativePath.slice(0, -3);
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
    };
}

/**
 * Called automatically after a successed `npm publish`, will push the generated documentation to the repo's Github Wiki.
 * @throw [Error](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Error) if any file prefixed by the package's version (`major.minor.patch-...`) exists.
 * To publish, remove all version's documentation, then launch this task manually.
 * @param done Callback function.
 */
function publishDocumentation(done: gulp.TaskFunctionCallback) {
    if (fsExtra.existsSync(paths.documentation.wiki)) {
        fsExtra.rmSync(paths.documentation.wiki, { recursive: true });
    }

    if (typeof gitRepoUrl !== "string") {
        throw new Error("Repository URL must be a string.");
    } else if (!gitRepoUrl.endsWith(".git")) {
        throw new Error("Repository URL must finish by '.git'.");
    } else if (new URL(gitRepoUrl).host !== "github.com") {
        throw Error(
            "This functionnality is made for Github. The repository's host must be 'github.com'."
        );
    }

    const gitRepoWiki = new URL(gitRepoUrl);
    gitRepoWiki.href = gitRepoWiki.href.replace(/\.git$/, ".wiki.git");

    fsExtra.mkdirSync(paths.documentation.wiki);

    if (process.env.GITHUB_TOKEN) {
        gitRepoWiki.username = gitRepoWiki.pathname.split("/")[1];
        gitRepoWiki.password = process.env.GITHUB_TOKEN;
    }

    const testUrl = new XMLHttpRequest.XMLHttpRequest();
    testUrl.open("GET", gitRepoWiki.toString(), false);
    testUrl.send(null);
    if (!testUrl.getAllResponseHeaders()) {
        throw new Error(
            `Generated wiki repo seems invalid: Cannot get headers from '${gitRepoWiki.toString()}'`
        );
    }

    const git = simpleGit.simpleGit(paths.documentation.wiki);
    git.clone(gitRepoWiki.toString(), ".", undefined)
        .then(() => {
            if (
                fsExtra.readdirSync(paths.documentation.wiki).filter((wikiFile) => {
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
                    path.resolve(paths.documentation.wiki, fileToCommit)
                );
            });

            const author = (() => {
                try {
                    return {
                        name: ChildProcess.execSync("git config user.name").toString(),
                        email: ChildProcess.execSync("git config user.email").toString(),
                    };
                } catch {
                    return {
                        name: "",
                        email: "",
                    };
                }
            })();

            if (author.name === "") {
                author.name = "[GULP] 'publishDocumentation' task";
                author.email = "";
            }

            git.addConfig("user.name", author.name)
                .addConfig("user.email", author.email)
                .add(filesToCommit)
                .then(() => {
                    git.commit(
                        `[GULP] Automatically generated documentation for version ${packageData.version}.`
                    )
                        .then(() => {
                            git.addTag(`v${packageData.version}`)
                                .then(() => {
                                    git.push()
                                        .then(() => {
                                            fsExtra.rmSync(paths.documentation.wiki, {
                                                recursive: true,
                                            });
                                            done();
                                        })
                                        .catch((error) => {
                                            throw new Error(
                                                `Something went wrong while pushing documentation to the remote: ${error}`
                                            );
                                        });
                                })
                                .catch((error) => {
                                    throw new Error(
                                        `Something went wrong while adding v${packageData.version} tag to documentation: ${error}`
                                    );
                                });
                        })
                        .catch((error) => {
                            throw new Error(
                                `Something went wrong while commiting v${packageData.version} documentation: ${error}`
                            );
                        });
                })
                .catch((error) => {
                    throw new Error(
                        `Something went wrong while adding v${packageData.version} documentation to stage: ${error}`
                    );
                });
        })
        .catch((error) => {
            throw new Error(`Something went wrong while cloning the wiki repository: ${error}`);
        });
}

gulp.task("clean", clean);

gulp.task("build", gulp.series("clean", transpile, minify));

gulp.task("documentate", gulp.series("clean", generateDocumentation));

gulp.task("publishDocumentation", gulp.series("documentate", publishDocumentation));
