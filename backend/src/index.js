import { fileURLToPath }    from 'url';
import path                 from 'path';

import { createApp }        from './app.js';

const rootfolder    = path.dirname(fileURLToPath(import.meta.url));
const dbfolder      = path.join(path.dirname(rootfolder), "db");
const frontendbuild = path.join(path.dirname(path.dirname(rootfolder)),"frontend","build");
const prefix        = process.env.APIPREFIX || "/api/v1";
const port          = process.env.PORT || 5000;
const logger        = console;

export const app = createApp(rootfolder,dbfolder,prefix,port,frontendbuild,logger);

