// ===== JEST
import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper, JestConfigWithTsJest } from "ts-jest";

// ===== UTILS
import * as path from "path";

const jestConfig: JestConfigWithTsJest = {
    rootDir: __dirname,
    preset: "ts-jest",
    roots: [path.resolve("tests/api")],
    resetMocks: true,
    resetModules: true,
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    setupFiles: [path.resolve("tests/setup.ts")],
};

export default jestConfig;
