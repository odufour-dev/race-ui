
export default class Router {

    #dbservice
    #fs
    #paths
    #router
     
    constructor(router,dbservice,paths,fs) {
        this.#router = router;
        this.#dbservice = dbservice;
        this.#paths = paths;
        this.#fs = fs;
    }

    get routes() {return this.#router;}

    initialize() {
        this.#router.get('/version',                    (req,res) => this.getVersion(req,res));
        this.#router.get('/competitions',               (req,res) => this.getCompetitions(req,res));
        this.#router.post('/competitions',              (req,res) => this.createCompetition(req,res));
        this.#router.post('/:competition/racers/sync',  (req,res) => this.syncRacers(req,res));
    }

    getVersion(req, res) {
        res.json({ version: '1.0.0', status: 'ok' });
    }

    getCompetitions(req, res){
        try {
            console.log(this.#paths.dbFolder);
            const files = this.#fs.readdirSync(this.#paths.dbFolder);
            const competitions = files
            .filter(file => file.endsWith('.db'))
            .map(file => ({
                id: file.replace('.db', ''),
                name: file.replace('.db', '') // Nom brut
            }));
            res.json(competitions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    createCompetition(req, res){
        try {
            const id = this.#dbservice.createCompetition(req.body.name);
            res.status(201).json({ id });
        } catch (e) {
            const code = e.message === "EXIST_ERROR" ? 409 : 500;
            res.status(code).json({ error: e.message });
        }
    }

    syncRacers(req, res){
        try {
            this.#dbservice.syncRacers(req.params.competition, req.body.racers);
            res.json({ message: "OK" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

}
