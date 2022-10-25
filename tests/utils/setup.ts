// MODULES
// Localstorage simulation for Node.js
import { LocalStorage as nodeLocalStorage } from "node-localstorage";

const before = () => {
    localStorage = new nodeLocalStorage(`${__dirname}/localstorage`);
};

const beforeEach = () => {
    //localStorage.clear();
};

const after = () => {
    localStorage._deleteLocation();
};

export { before, beforeEach, after };
