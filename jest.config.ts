// JEST
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";

// UTILS
import * as path from "path";

const jestConfig: JestConfigWithTsJest = {
    rootDir: __dirname,
    preset: "ts-jest",
    roots: ["tests/api"],
    resetMocks: true,
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    setupFiles: [path.resolve("tests/setup.ts")],
};

export default jestConfig;
