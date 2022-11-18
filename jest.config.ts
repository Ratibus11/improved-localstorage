// JEST
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";

// UTILS
import * as path from "path";

const jestConfig: JestConfigWithTsJest = {
    rootDir: __dirname,
    preset: "ts-jest",
    roots: [path.resolve(process.cwd(), "tests/api")],
    resetMocks: true,
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    setupFiles: [path.resolve(process.cwd(), "tests/setup.ts")],
};

export default jestConfig;
