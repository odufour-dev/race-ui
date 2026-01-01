
import CompetitionRoute         from './routes/competition.js';
import RacerRoute               from './routes/racer.js';
import VersionRoute             from './routes/version.js';

import Database                 from './database/database.js';
import StaticRouter             from './routes/static.js';
import Tools                    from './tools/tools.js';

export const createApp = async (dbfolder,apiprefix,port,frontendbuildpath,logger = console) => {

    const tools = new Tools(dbfolder, logger);

    const database = new Database(tools, logger);
    await database.initialize();
    
    // Register API routes
    const routes = [
        new CompetitionRoute(database,logger),
        new RacerRoute(database,logger),
        new VersionRoute(database,logger),
    ];

    const router = tools.express.router;
    routes.map((r) => r.register(router));    
    tools.express.registerRoutes(apiprefix, router);
    
    // Register Static Routes for the front-end files
    const staticrouter  = new StaticRouter(tools, frontendbuildpath);
    staticrouter.register();

    // Listen at port 
    const server = tools.express.listen(port);

    return {
        httpServer: server,
        dbConnector: tools.connector
    }

}
