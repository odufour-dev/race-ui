
import Database                 from './database/database.js';
import {APIRouter,StaticRouter} from './routes/routers.js';
import Tools                    from './tools/tools.js';

export const createApp = async (rootfolder,dbfolder,apiprefix,port,schemapath,frontendbuildpath,logger = console) => {

    const tools = new Tools(rootfolder, dbfolder, logger);

    const database      = new Database(tools, schemapath, logger);
    const apirouter     = new APIRouter(tools, database, apiprefix, logger);
    const staticrouter  = new StaticRouter(tools, frontendbuildpath);

    await database.initialize();
    
    // Register API routes
    apirouter.register();
    staticrouter.register();

    // Listen at port 
    const server = tools.express.listen(port);

    return {
        httpServer: server,
        dbConnector: tools.connector
    }

}
