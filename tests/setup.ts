// UTILS
import * as path from "path";
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

global.localStorage = new nodeLocalStorage(path.resolve(process.cwd(), "./tests/.localstorage"));
