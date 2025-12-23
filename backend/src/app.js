
import Paths from './config/paths.js';
import DatabaseService from './database/services.js';
import Router from './routes/routes.js';

export class App {

    #app
    #cors
    #express
    #fs
    #path
    #port

    #dbservice
    #paths
    #router

    constructor(express, cors, fs, path, dirname, port = 5000, paths = null, router = null, dbservice = null) {
        
        this.#app           = express.instance;
        this.#cors          = cors;      
        this.#express       = express;
        this.#fs            = fs;
        this.#path          = path;
        this.#port          = port;

        this.#paths     = paths ? paths : new Paths(path, fs, dirname);
        this.#dbservice = dbservice ? dbservice : new DatabaseService(fs, this.#paths);
        this.#router    = router ? router : new Router(this.#express.router, this.#dbservice, this.#paths, fs);

    }

    initialize(){

        this.#app.use(this.#cors);
        this.#app.use(this.#express.json);
        
        this.#paths.initialize();
        this.#router.initialize();

        // Routes API
        const routes = this.#router.routes;
        this.#app.use('/api/v1', routes);

        // Statique & Catch-all React
        this.#app.use(this.#express.static(this.#paths.frontendBuildPath));
        this.#app.get('*', (req, res) => {
            const indexPath = this.#path.join(this.#paths.frontendBuildPath, 'index.html');
            this.#fs.existsSync(indexPath) ? res.sendFile(indexPath) : res.status(404).send("Build missing");
        });
    }

    listen(){
        this.#app.listen(this.#port, () => {
            console.log(`🚀 Serveur démarré sur le port ${this.#port}`);
        });
    }

}
