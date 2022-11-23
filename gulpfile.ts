import * as gulp from "gulp";

// Gulp modules
import * as gulpTypescript from "gulp-typescript";
import * as gulpUglify from "gulp-uglify";
import * as gulpTypedoc from "gulp-typedoc";

// Utils
import * as fsExtra from "fs-extra";
import * as merge2 from "merge2";
import * as path from "path";
import * as browserify from "browserify";
import * as vinylSourceStream from "vinyl-source-stream";
import * as vinylBuffer from "vinyl-buffer";
import * as chokidar from "chokidar";
import * as glob from "glob";

const cwd = __dirname;
const paths = {
    clean: ["docs", "build"],
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
        version: {
            path: path.resolve("docs", process.env.npm_package_version!),
            glob: path.resolve("docs", process.env.npm_package_version!, "**/*.*"),
            clean: { include: ["**/*"], exclude: ["**/[!README]*.md"] },
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
 * Generate app's documentation.
 * @param done Callback function.
 */
function documentate(done: gulp.TaskFunctionCallback) {
    // Delete old non-markdown file (and README.md)
    ["**/*"].forEach((docGlob) => {
        glob.sync(docGlob, {
            cwd: paths.documentation.version.path,
            ignore: ["**/[!README]*.md"],
            dot: true,
            absolute: true,
        }).forEach((filePath) => {
            if (fsExtra.lstatSync(filePath).isFile()) {
                fsExtra.rmSync(filePath);
            }
        });
    });

    // Rewrite all markdowns' links
    glob.sync(paths.documentation.version.glob, {
        cwd: paths.documentation.version.path,
        absolute: true,
    }).forEach((filePath) => {
        const versionnedName = path.relative(paths.documentation.main, filePath);
        const newFileName = path.resolve(
            paths.documentation.version.path,
            versionnedName.replaceAll("/", "-")
        );

        var content = fsExtra.readFileSync(filePath).toString();

        content.match(/\[.+?\]\(.+?\)/g)?.forEach((markdownLink) => {
            const linkPath = markdownLink.match(/\(.*?\)/)![0].slice(1, -1);

            const absolutePath = path.resolve(path.dirname(filePath), linkPath);

            const anchorPosition = absolutePath.lastIndexOf("#");
            const absoluePathWithoutAnchor = absolutePath.slice(
                0,
                anchorPosition === -1 ? undefined : anchorPosition
            );

            if (fsExtra.existsSync(absoluePathWithoutAnchor)) {
                const newLinkPath = path
                    .relative(paths.documentation.main, absolutePath)
                    .replaceAll("/", "-");
                const newMarkdownLink = markdownLink.replace(linkPath, newLinkPath);

                content = content.replace(markdownLink, newMarkdownLink);
            } else if (
                path.relative(absoluePathWithoutAnchor, paths.documentation.version.path) == ".." &&
                path.basename(absoluePathWithoutAnchor) === "README.md"
            ) {
                const newMarkdownLink = markdownLink.replace(linkPath, "Home.md");
                content = content.replace(markdownLink, newMarkdownLink);
            }
        });

        const newFilePath = path.resolve(
            paths.documentation.version.path,
            path.relative(paths.documentation.main, filePath).replaceAll("/", "-")
        );
        fsExtra.writeFileSync(newFilePath, content);
        fsExtra.rmSync(filePath);
    });

    // Delete all non-markdown files ()
    glob.sync("**/*", { absolute: true, cwd: paths.documentation.version.path }).forEach(
        (filePath) => {
            if (fsExtra.lstatSync(filePath).isDirectory()) {
                fsExtra.rmSync(filePath, { recursive: true });
            }
        }
    );

    done();

    /*return gulp
        .src(paths.typescript.glob)
        .pipe(gulpTypedoc({ out: paths.documentation.out, version: true }))
        .on("end", () => {
            const watcher = chokidar.watch(paths.documentation.out, { depth: 1 });

            watcher.on("add", () => {
                watcher.close();

                // FUNCTION
            });
        });*/
}

gulp.task("clean", gulp.series(clean));

gulp.task("build", gulp.series(clean, transpile, minify));

gulp.task("documentate", gulp.series(copy, documentate));

function copy(done: gulp.TaskFunctionCallback) {
    fsExtra.rmSync("docs", { recursive: true });
    fsExtra.copySync("docs-save", "docs");

    done();
}
