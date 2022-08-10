const gulp = require("gulp");

// Gulp modules
const gulp_typescript = require("gulp-typescript");
const gulp_minify = require("gulp-minify");
const gulp_rename = require("gulp-rename");

// Utils
const fs = require("fs");
const merge2 = require("merge2");
const glob = require("glob");
const childProcess = require("child_process");

const typescriptProject = gulp_typescript.createProject("tsconfig.json");

function clean(callback) {
	["app", "types"].map((path) => {
		if (fs.existsSync(path)) fs.rmSync(path, { recursive: true });
	});

	callback();
}

function build(callback) {
	const typescriptResult = typescriptProject.src().pipe(typescriptProject());

	return merge2([
		typescriptResult.js.pipe(gulp.dest("app")),
		typescriptResult.dts.pipe(gulp.dest("types")),
	]);
}

function minify(callback) {
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

gulp.task("clean", gulp.series(clean));

gulp.task("build", gulp.series(clean, build, minify));
