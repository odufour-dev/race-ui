
import Database                 from './database/database.js';
import {APIRouter,StaticRouter} from './routes/routers.js';
import Tools                    from './tools/tools.js';

export const createApp = (rootfolder,dbfolder,apiprefix,port,schemapath,frontendbuildpath,logger = console) => {

    const tools = new Tools(rootfolder, dbfolder, logger);

    const database      = new Database(tools, schemapath);
    const apirouter     = new APIRouter(tools, database, apiprefix);
    const staticrouter  = new StaticRouter(tools, frontendbuildpath);

    // Register API routes
    apirouter.register();
    staticrouter.register();

    // Listen at port 
    return tools.express.listen(port);

}
