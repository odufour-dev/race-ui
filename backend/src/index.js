import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { App } from './app.js';

class Express {

    get instance() {
        return express();
    }
    get json() {
        return express.json();
    }
    get router() {
        return express.Router();
    }
    static(url) {
        return express.static(url);
    }
}

const __filename = fileURLToPath(import.meta.url);

const expr  = new Express();
const myApp = new App(expr, cors(), fs, path, dirname(__filename), process.env.PORT || 5000);
myApp.initialize();
myApp.listen();
