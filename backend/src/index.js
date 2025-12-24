import Database                 from './database/database.js';
import {APIRouter,StaticRouter} from './routes/routers.js';
import Tools                    from './tools/tools.js';

// Application parameters
const apiprefix         = "/api/v1";
const dbfolder          = "../db";
const port              = process.env.PORT || 5000;
const schemapath        = "schema.sql";
const frontendbuildpath = "../../frontend/build";

const baseurl = import.meta.url;
const tools = new Tools(baseurl);

const database      = new Database(tools, dbfolder, schemapath);
const apirouter     = new APIRouter(tools, database, apiprefix);
const staticrouter  = new StaticRouter(tools, frontendbuildpath);

// Register API routes
apirouter.register();
staticrouter.register();

// Listen at port 
tools.express.listen(port);