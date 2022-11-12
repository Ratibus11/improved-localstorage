const gulp = require("gulp");

// Gulp modules
const gulp_typescript = require("gulp-typescript");
const gulp_minify = require("gulp-minify");
const gulp_rename = require("gulp-rename");

// Utils
const fs = require("fs");
const merge2 = require("merge2");
const glob = require("glob");

/**
 * Delete build folders (app for compiled TS to JS / types for TS declaration files).
 * @param {any} callback Callback when the task is done.
 */
function clean(callback) {
    ["app", "types"].map((path) => {
        if (fs.existsSync(path)) fs.rmSync(path, { recursive: true });
    });

    callback();
}

/**
 * Compile TS to JS in `app` folder and TS declaration files in `types`.
 * @returns {any} Task pipes
 */
function build() {
    const typescriptProject = gulp_typescript.createProject("tsconfig.json");
    const typescriptResult = gulp.src("src/**/*.ts").pipe(typescriptProject());

    return merge2([
        typescriptResult.js.pipe(gulp.dest("app")),
        typescriptResult.dts.pipe(gulp.dest("types")),
    ]);
}

/**
 * Minify JS build files.
 * @returns Task pipes.
 */
function minify() {
    return gulp
        .src("app/**/*.js")
        .pipe(gulp_minify({ ext: { src: ".js", min: ".min.js" } }))
        .pipe(gulp.dest("app"))
        .on("end", () => {
            gulp.src("app/**/*.min.js")
                .pipe(
                    gulp_rename((path) => {
                        path.basename = path.basename.replace(/.min$/, "");
                    })
                )
                .pipe(gulp.dest("app"))
                .on("end", () => {
                    glob.sync("app/**/*.min.js").forEach((file) => {
                        fs.rmSync(file);
                    });
                });
        });
}

// Only delete the build folders
gulp.task("clean", gulp.series(clean));

// Delete build folders, build and minify the project.
gulp.task("build", gulp.series(clean, build, minify));
