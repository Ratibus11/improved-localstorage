import * as gulp from "gulp";

// ===== GULP PLUGINS

import gulpTypedoc from "gulp-typedoc";

// ===== UTILS

import * as fsExtra from "fs-extra";
import * as path from "path";
import * as glob from "glob";
import * as simpleGit from "simple-git";
import * as ChildProcess from "child_process";

import * as packageJson from "./package.json";

// ===== TASKS

gulp.task("clean", cleanAll);

gulp.task(
    "document",
    gulp.series(
        cleanDocumentation,
        cleanDocumentation,
        generateRawDocumentation,
        transformDocumentation
    )
);

gulp.task(
    "publishDocumentation",
    gulp.series("document", cloneRepo, copyDocumentation, publishNewDocumentation)
);

// ===== VARIABLES

/**
 * Project's repo to publish documentation. Must be a Github repo and finish be `.git`.
 */
const remoteRepoUrl = "https://github.com/Ratibus11/improved-localstorage.git";
/**
 * Project metadata.
 */
const packageData = {
    version: packageJson.version!,
    name: {
        display: {
            name: packageJson.displayName,
            versioned: `${packageJson.displayName} - ${packageJson.version!}`,
        },
    },
};
/**
 * Maximum tries to detect TypeDoc-generated documentation. A try is triggered every 1 second.
 */
const documentationDetectionTries = 10;
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
        },
    },
    documentation: {
        typedocGeneration: path.resolve("docs/.tmp"),
        versioned: path.resolve("docs", packageData.version),
        wiki: path.resolve("docs/.github-wiki"),
    },
};
/**
 * List of folders to delete before tasks' launch.
 */
const foldersToClean = {
    build: [paths.build.js.path].map((folderToClean) => {
        return path.resolve(folderToClean);
    }),
    documentation: [
        paths.documentation.versioned,
        paths.documentation.wiki,
        paths.documentation.typedocGeneration,
    ].map((folderToClean) => {
        return path.resolve(folderToClean);
    }),
};

// ===== TASKS FUNCTIONS

/**
 * Clean elements.
 * @param foldersToClean Files/folders to clean.
 */
function clean(foldersToClean: string[]): void {
    foldersToClean.forEach((folderToClean) => {
        if (fsExtra.existsSync(folderToClean)) {
            fsExtra.rmSync(folderToClean, { recursive: true });
        }
    });
}

/**
 * Clean build and documentation folders.
 * @param done Callback function.
 */
function cleanAll(done: gulp.TaskFunctionCallback): void {
    clean([...foldersToClean.build, ...foldersToClean.documentation]);
    done();
}

/**
 * Clean only documentation folders.
 * @param done Callback function.
 */
function cleanDocumentation(done: gulp.TaskFunctionCallback): void {
    clean(foldersToClean.documentation);
    done();
}

/**
 * Generate documentation with TypeDoc (in `docs/tmp`).
 * @param done Callback function.
 */
function generateRawDocumentation(done: gulp.TaskFunctionCallback): void {
    gulp.src(path.resolve(paths.source.entry))
        .pipe(
            gulpTypedoc({
                out: paths.documentation.typedocGeneration,
                version: true,
                excludePrivate: true,
                excludeProtected: true,
                hideGenerator: true,
                gitRevision: "",
                name: packageData.name.display.versioned,
            })
        )
        .on("end", () => {
            var tries = 0;

            const interval = setInterval(() => {
                tries++;

                if (tries < documentationDetectionTries) {
                    console.info(
                        `Try ${tries}/${documentationDetectionTries} to detect documentation folder...`
                    );
                } else if (tries === documentationDetectionTries) {
                    clearInterval(interval);
                    throw Error("Unable to detect documentation folder.");
                }

                if (fsExtra.existsSync(paths.documentation.typedocGeneration)) {
                    console.info(
                        `Documentation folder for version ${packageData.version} detected.`
                    );
                    clearInterval(interval);

                    done();
                }
            }, 1000);
        });
}

/**
 * Load all generated documentation (all `*.ts` in `docs/tmp/**`) and convert them into Github Wiki-like files.
 * @param done Callback function.
 */
function transformDocumentation(done: gulp.TaskFunctionCallback): void {
    fsExtra.mkdirSync(paths.documentation.versioned);

    glob.sync("**/*.md", {
        absolute: true,
        cwd: paths.documentation.typedocGeneration,
    })
        .filter((documentationFilePath) => {
            return path.basename(documentationFilePath) !== "README.md";
        })
        .forEach((documentationFilePath) => {
            const documentationFile = new DocumentationFile(documentationFilePath);

            documentationFile.rewriteMarkdownLinks();
            documentationFile.saveInVersionedDocumentationFolder();
        });

    fsExtra.rmSync(paths.documentation.typedocGeneration, { recursive: true });

    done();
}

/**
 * Check the provided repo URL's validity.
 * @param done Callback function
 * @remarks Repo's URL must be a Github link, finishing by .git. The URL must point the Git repo, not the wiki.
 */
function cloneRepo(done: gulp.TaskFunctionCallback): void {
    const repoUrl = new URL(remoteRepoUrl);

    if (!repoUrl.pathname.endsWith(".git")) {
        throw new Error("Repository URL must finish by '.git'.");
    } else if (repoUrl.host !== "github.com") {
        throw Error("Wiki documentation is only available for Github.");
    }

    repoUrl.href = repoUrl.href.replace(/\.git$/, ".wiki.git");

    if (process.env.GITHUB_TOKEN) {
        repoUrl.username = repoUrl.pathname.split("/")[1];
        repoUrl.password = process.env.GITHUB_TOKEN;
    }

    fsExtra.mkdirSync(paths.documentation.wiki);

    const git = simpleGit.simpleGit(paths.documentation.wiki);
    git.clone(repoUrl.toString(), ".")
        .then(() => {
            done();
        })
        .catch((error) => {
            throw new Error(`Something went wrong while cloning the repo: ${error}`);
        });
}

/**
 * Copy the documentation for the current version into the repo.
 * @param done Callback function.
 * @remarks For safety purpose, the copy cannot be done if any file already exists for the current version (No a.b.c files must exists if the current version is a.b.c).
 */
function copyDocumentation(done: gulp.TaskFunctionCallback): void {
    if (
        glob.sync("**", { cwd: paths.documentation.wiki }).filter((wikiFile) => {
            return wikiFile.startsWith(packageData.version);
        }).length !== 0
    ) {
        throw new Error(
            `Documentation for version ${packageData.version} is already on the repo's wiki. To bypass it, please remove first all '${packageData.version}-x.md' files, then run 'gulp publishDocumentation'.`
        );
    }

    glob.sync("**", { cwd: paths.documentation.versioned, absolute: true }).forEach(
        (fileToCopy) => {
            fsExtra.copyFileSync(
                fileToCopy,
                path.resolve(paths.documentation.wiki, path.basename(fileToCopy))
            );
        }
    );

    done();
}

/**
 * Set commit's author, commit the new documentation, then push it.
 * @param done Callback function.
 * @remarks If set, the author will be the one defined in the git config, else, it will be a "ghost committer".
 */
function publishNewDocumentation(done: gulp.TaskFunctionCallback): void {
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
        author.name = "[TASK] Gulp - Documentation publication";
        author.email = "";
    }

    const git = simpleGit.simpleGit(paths.documentation.wiki);

    git.addConfig("user.name", author.name)
        .addConfig("user.email", author.email)
        .add(
            glob.sync(`${packageData.version}*.md`, {
                cwd: paths.documentation.versioned,
            })
        )
        .then(() => {
            git.commit(
                `[GULP] Automatically generated documentation for version ${packageData.version}.`
            )
                .then(() => {
                    git.push()
                        .then(() => {})
                        .catch((error) => {
                            throw new Error(
                                `Something went wrong while pushing the documentation: ${error}`
                            );
                        });
                })
                .catch((error) => {
                    throw new Error(
                        `Something went wrong while committing new documentation: ${error}`
                    );
                });
        })
        .catch((error) => {
            throw new Error(`Something went wrong while adding files to the commit: ${error}`);
        });

    done();
}

// ===== DEPENDENCIES

/**
 * A markdown file generated by Typedoc.
 */
class DocumentationFile {
    /**
     * Original file's path.
     */
    private readonly __typeDocFilePath: string;
    /**
     * All markdown links (`[...](...#...)`) in the file.
     */
    private readonly __markdownLinks: DocumentationFileLink[];
    /**
     * File's content.
     */
    private __content: string;

    /**
     * From the file's path, load its content and its markdown links.
     * @param typeDocFilePath
     */
    constructor(typeDocFilePath: string) {
        if (!fsExtra.existsSync(typeDocFilePath)) {
            throw Error(`${typeDocFilePath} does not exists.`);
        }

        this.__typeDocFilePath = typeDocFilePath;
        this.__content = fsExtra.readFileSync(this.__typeDocFilePath).toString();

        this.__markdownLinks = this.__getMarkdownLinks();
    }

    /**
     * Get all markdown links that are not web links (`[...](http...)`).
     * @returns All non-web markdown links.
     */
    private __getMarkdownLinks(): DocumentationFileLink[] {
        return (
            this.__content
                .match(/\[.+?\]\(.+?\)/g)
                ?.map((markdownLink) => {
                    return new DocumentationFileLink(markdownLink);
                })
                .filter((documentationFileLink) => {
                    return !documentationFileLink.isHttp;
                }) || []
        );
    }

    /**
     * Replace all markdown links with their new label and link.
     */
    public rewriteMarkdownLinks(): void {
        this.__markdownLinks.forEach((markdownLink) => {
            this.__content = this.__content.replace(
                markdownLink.originalMarkdownLink,
                markdownLink.newMarkdownLink
            );
        });
    }

    /**
     * Get TypeDoc file's path equivalent as Github Wiki file
     * @example
     * // "path/to/my/docs/tmp/classes/errors.aCustomError.md"
     * this.__newDocumentationFilePath // "path/to/my/docs/packageVersion/packageVersion-errors.aCustomError.md"
     * @remarks If the file's basename is `"modules.md"`, the basename will be replaced by `"packageVersion.md"`
     */
    private get __newDocumentationFilePath(): string {
        const fileName = path.relative(
            paths.documentation.typedocGeneration,
            this.__typeDocFilePath
        );

        switch (fileName) {
            case "modules.md":
                return path.resolve(paths.documentation.versioned, `${packageData.version}.md`);
            default:
                const newFileName = `${packageData.version}/${fileName}`
                    .split("/")
                    .filter((_, index) => {
                        return index !== 1;
                    })
                    .join("-");

                return path.resolve(paths.documentation.versioned, newFileName);
        }
    }

    /**
     * Save file's content into it Github wiki's path.
     */
    public saveInVersionedDocumentationFolder(): void {
        fsExtra.writeFileSync(this.__newDocumentationFilePath, this.__content);
    }
}

/**
 * A markdown link (`[...](...#...)`).
 */
class DocumentationFileLink {
    /**
     * Markdown link's label (`"[myLabel](...)"`)
     */
    private __label: string;
    /**
     * Markdown link's link (`"[...](myLink#...")`)
     */
    private __link: string;
    /**
     * Markdown link's anchor (`"[...](...#myAnchor")`)
     */
    private __anchor: string | undefined;

    /**
     * Extract markdown link's data (label, link, anchor).
     * @param markdownLink Raw markdown link (`[...](...#...)`).
     */
    constructor(markdownLink: string) {
        this.__label = markdownLink.match(/\[.*?\]/g)![0].slice(1, -1);

        const relativePath = markdownLink.match(/\(.*?\)/)![0].slice(1, -1);
        const hasAnchor = relativePath.lastIndexOf("#") !== -1;

        this.__link = hasAnchor
            ? relativePath.slice(0, relativePath.lastIndexOf("#"))
            : relativePath;
        this.__anchor = hasAnchor
            ? relativePath.slice(relativePath.lastIndexOf("#") + 1)
            : undefined;
    }

    /**
     * Retrieve original markdown link.
     */
    public get originalMarkdownLink(): string {
        return `[${this.__label}](${this.__link}${
            this.__anchor === undefined ? "" : `#${this.__anchor}`
        })`;
    }

    /**
     * Get markdown link's new label.
     * @remarks By default, it will return the original label, but, if the label is `"myPackageDisplayName - myPackageVersion"`, it will return `"myPackageDisplayName"`, and if the label is "Exports", it will return `"myPackageVersion"`.
     */
    private get __newLabel(): string {
        switch (this.__label) {
            case packageData.name.display.versioned:
                return packageData.name.display.name;
            case "Exports":
                return packageData.version;
            default:
                return this.__label;
        }
    }

    /**
     * Get markdown link's new link.
     * @remarks By default, it will return a transformed link like `"classes/errors.aCustomError.md"` as `"packageVersion-errors.aCustomError"`, but if the link's basename is `"README.md"`, it will return `"Home"`, and if the link's basename is `"modules.md"`, it will return `"myPackageVersion"`.
     */
    private get __newLink(): string {
        switch (path.basename(this.__link)) {
            case "README.md":
                return "Home";
            case "modules.md":
                return packageData.version;
            default:
                return `${packageData.version}-${this.__link
                    .replace(/^\.\.\//g, "")
                    .replace(/\.md$/g, "")
                    .split("/")
                    .filter((_, index, array) => {
                        return array.length < 2 || (array.length >= 2 && index !== 0);
                    })
                    .join("-")}`;
        }
    }

    /**
     * Generate the new markdown link to replace the old one.
     * @example
     * // "[Exports](../modules.md#myAnchor)"
     * newMarkdownLink // "[myPackageVersion](../myPackageVersion#myAnchor)"
     */
    public get newMarkdownLink(): string {
        return `[${this.__newLabel}](${this.__newLink}${
            this.__anchor === undefined ? "" : `#${this.__anchor}`
        })`;
    }

    /**
     * If the link starts with `"http"`, will return `true`, `false` otherwise.
     */
    public get isHttp(): boolean {
        return this.__link.startsWith("http");
    }
}
