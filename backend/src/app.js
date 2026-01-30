
import CompetitionRoutes        from './routes/competition.js';
import ConfigurationRoutes      from './routes/configuration.js';
import GeneralRankingRoutes     from './routes/generalranking.js';
import RacerRoutes              from './routes/racer.js';
import StageAnnexRoutes         from './routes/stageannex.js';
import StageRankingRoutes       from './routes/stageranking.js';
import VersionRoutes            from './routes/version.js';
import StaticRoutes             from './routes/static.js';

import createConnector          from './database/connector.js';
import createMigrator           from './database/migrator.js';

import createProcessors         from './processors/processors.js';

import createServer             from './tools/express.js';
import createFiles              from './tools/files.js';

export const createApp = async (appfolder, dbfolder,apiprefix,port,frontendbuildpath,logger = console) => {

    // Create utility classes
    const files     = createFiles(logger);
    const server    = createServer(logger);

    const migrator  = createMigrator(files.joinPath(appfolder, 'migrations'), logger);
    const connector = await createConnector(files, dbfolder, 'master', migrator, logger);
    
    const processor = createProcessors();

    // Register API routes
    const routes = [
        new CompetitionRoutes       (connector,processor,logger),
        new ConfigurationRoutes     (connector,processor,logger),
        new GeneralRankingRoutes    (connector,processor,logger),
        new RacerRoutes             (connector,processor,logger),
        new StageAnnexRoutes        (connector,processor,logger),
        new StageRankingRoutes      (connector,processor,logger),
        new VersionRoutes           (connector,processor,logger),
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
