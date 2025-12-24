
export class APIRouter {

    #apiprefix
    #database
    #tools
     
    constructor(tools,database,apiprefix) {
        this.#apiprefix = apiprefix;
        this.#database  = database;
        this.#tools     = tools;
    }

    register() {

        const router = this.#tools.express.router;

        // Routes
        router.get('/version',                    (req,res) => this.getVersion(req,res));
        router.get('/competitions',               (req,res) => this.getCompetitions(req,res));
        router.post('/competitions',              (req,res) => this.createCompetition(req,res));
        router.post('/:competition/racers/sync',  (req,res) => this.syncRacers(req,res));

        this.#tools.express.registerRoutes(this.#apiprefix, router);
    }

    getVersion(req, res) {
        res.json({ version: '1.0.0', status: 'ok' });
    }

    getCompetitions(req, res){
        try {console.log("GET /competitions");
            const competitions = this.#database.listCompetitions();
            res.json(competitions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createCompetition(req, res){
        try {
            const id = this.#database.createCompetition(req.body.name);
            res.status(201).json({ id });
        } catch (e) {
            const code = e.message === "EXIST_ERROR" ? 409 : 500;
            res.status(code).json({ error: e.message });
        }
    }

    syncRacers(req, res){
        try {
            this.#database.syncRacers(req.params.competition, req.body.racers);
            res.json({ message: "OK" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}

export class StaticRouter {

    #filepaths
    #tools

    constructor(tools,filepaths){
        this.#filepaths = filepaths;
        this.#tools     = tools;
    }

    register(){
        this.#tools.express.registerStatic(this.#filepaths,(req, res) => {
            const indexPath = this.#tools.files.joinAbsolutePath(this.#filepaths, 'index.html');
            this.#tools.files.exists(indexPath) ? res.sendFile(indexPath) : res.status(404).send("Build missing");
        });
    }
    
}
