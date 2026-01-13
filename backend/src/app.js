
import CompetitionRoutes    from './routes/competition.js';
import ConfigurationRoutes  from './routes/configuration.js';
import RacerRoutes          from './routes/racer.js';
import StageAnnexRoutes     from './routes/stageannex.js';
import StageRankingRoutes   from './routes/stageranking.js';
import VersionRoutes        from './routes/version.js';
import StaticRoutes         from './routes/static.js';

import createConnector      from './database/connector.js';

import createServer         from './tools/express.js';
import createFiles          from './tools/files.js';

export const createApp = async (dbfolder,apiprefix,port,frontendbuildpath,logger = console) => {

    // Create utility classes
    const files     = createFiles(logger);
    const server    = createServer(logger);

    const connector = await createConnector(files, dbfolder, 'master', logger);
    
    // Register API routes
    const routes = [
        new CompetitionRoutes(connector,logger),
        new ConfigurationRoutes(connector,logger),
        new RacerRoutes(connector,logger),
        new StageAnnexRoutes(connector,logger),
        new StageRankingRoutes(connector,logger),
        new VersionRoutes(connector,logger),
    ];

    const router = server.router;
    routes.map((r) => r.register(router));    
    server.registerRoutes(apiprefix, router);
    
    // Register Static Routes for the front-end files
    const staticroutes = new StaticRoutes(files, frontendbuildpath, logger);
    staticroutes.register(server);

    // Listen at port 
    const httpServer = server.listen(port);

    return {
        httpServer: httpServer,
        dbConnector: connector
    }

}
