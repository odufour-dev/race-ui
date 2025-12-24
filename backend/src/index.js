import { fileURLToPath }    from 'url';
import { dirname }          from 'path';

import { createApp } from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const app = createApp(
    __dirname,
    "../db",
    "/api/v1",
    process.env.PORT || 5000,
    "schema.sql",
    "../../frontend/build"
);

