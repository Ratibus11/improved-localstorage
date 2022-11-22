import * as gulp from "gulp";

// Gulp modules
import * as gulpTypescript from "gulp-typescript";
import * as gulpUglify from "gulp-uglify";

// Utils
import * as fs from "fs";
import * as merge2 from "merge2";
import * as path from "path";
import * as browserify from "browserify";
import * as vinylSourceStream from "vinyl-source-stream";
import * as vinylBuffer from "vinyl-buffer";

const cwd = __dirname;
const paths = {
    clean: ["build"],
    typescript: {
        tsconfig: path.resolve(cwd, "tsconfig.json"),
        entry: path.resolve(cwd, "src/main.ts"),
        glob: path.resolve(cwd, "src/**/*.ts"),
    },
    transpiled: {
        entry: path.resolve(cwd, "build/build/main.js"),
        app: path.resolve(cwd, "build/build"),
    },
    build: {
        types: path.resolve(cwd, "build/types"),
        app: {
            path: cwd,
            name: "build/app.js",
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

        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true });
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
            fs.rmSync(paths.transpiled.app, { recursive: true });
            done();
        });
}

/**
 * Generate app's documentation.
 * @param done Callback function.
 */
function documentate(done: gulp.TaskFunctionCallback) {
    done();
}

gulp.task("clean", gulp.series(clean));

gulp.task("build", gulp.series(clean, transpile, minify));
