
import CompetitionRoutes        from './routes/competition.js';
import ConfigurationRoutes      from './routes/configuration.js';
import GeneralRankingRoutes     from './routes/generalranking.js';
import RacerRoutes              from './routes/racer.js';
import StageAnnexRoutes         from './routes/stageannex.js';
import StageRankingRoutes       from './routes/stageranking.js';
import TeamRankingRoutes        from './routes/teamranking.js';
import VersionRoutes            from './routes/version.js';
import StaticRoutes             from './routes/static.js';

import createConnector          from './database/connector.js';
import createMigrator           from './database/migrator.js';

import createProcessors         from './processors/processors.js';

import createServer             from './tools/express.js';
import createFiles              from './tools/files.js';
import createTimes              from './tools/time.js';

export const createApp = async (appfolder, dbfolder,apiprefix,port,frontendbuildpath,logger = console) => {

    // Create utility classes
    const files     = createFiles(logger);
    const server    = createServer(logger);
    const times     = createTimes(logger);

    const migrator  = createMigrator(files.joinPath(appfolder, 'migrations'), logger);
    const connector = await createConnector(files, dbfolder, 'master', migrator, logger);
    
    const processor = createProcessors();

    // Register API routes
    const routes = [
        new CompetitionRoutes       (connector,processor,times,logger),
        new ConfigurationRoutes     (connector,processor,times,logger),
        new GeneralRankingRoutes    (connector,processor,times,logger),
        new RacerRoutes             (connector,processor,times,logger),
        new StageAnnexRoutes        (connector,processor,times,logger),
        new StageRankingRoutes      (connector,processor,times,logger),
        new TeamRankingRoutes       (connector,processor,times,logger),
        new VersionRoutes           (connector,processor,times,logger),
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
