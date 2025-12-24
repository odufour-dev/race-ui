
import Database                 from './database/database.js';
import {APIRouter,StaticRouter} from './routes/routers.js';
import Tools                    from './tools/tools.js';

export const createApp = (rootfolder,dbfolder,apiprefix,port,schemapath,frontendbuildpath) => {

    const tools = new Tools(rootfolder);

    const database      = new Database(tools, dbfolder, schemapath);
    const apirouter     = new APIRouter(tools, database, apiprefix);
    const staticrouter  = new StaticRouter(tools, frontendbuildpath);

    // Register API routes
    apirouter.register();
    staticrouter.register();

    // Listen at port 
    tools.express.listen(port);

    return tools.express.instance;

}
