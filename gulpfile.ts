import * as gulp from "gulp";

// Gulp modules
import * as gulpTypescript from "gulp-typescript";
import * as gulpUglify from "gulp-uglify";

// Utils
import * as fs from "fs";
import * as merge2 from "merge2";
import * as path from "path";
import * as browserify from "browserify";
import * as source from "vinyl-source-stream";
import * as buffer from "vinyl-buffer";

const cwd = process.cwd();
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

function clean(done: gulp.TaskFunctionCallback) {
    paths.clean.forEach((folder) => {
        const folderPath = path.resolve(process.cwd(), folder);

        if (fs.existsSync(folderPath)) {
            fs.rmSync(folderPath, { recursive: true });
        }
    });

    done();
}

function transpile(done: gulp.TaskFunctionCallback) {
    const typescriptProject = gulpTypescript.createProject(paths.typescript.tsconfig);
    const typescriptResult = gulp.src(paths.typescript.glob).pipe(typescriptProject());

    return merge2([
        typescriptResult.js.pipe(gulp.dest(paths.transpiled.app)),
        typescriptResult.dts.pipe(gulp.dest(paths.build.types)),
    ]);
}

function minify(done: gulp.TaskFunctionCallback) {
    return browserify({
        entries: paths.transpiled.entry,
        debug: true,
    })
        .bundle()
        .pipe(source(paths.build.app.name))
        .pipe(buffer())
        .pipe(gulpUglify())
        .pipe(gulp.dest(paths.build.app.path))
        .on("end", () => {
            fs.rmSync(paths.transpiled.app, { recursive: true });
        });
}

function documentate(done: gulp.TaskFunctionCallback) {
    done();
}

gulp.task("clean", gulp.series(clean));

gulp.task("build", gulp.series(clean, transpile, minify));
