
import Route from "./route.js"

export default class Competition extends Route {

    register(router){
        router.get('/competitions',     async (req,res) => await this.#list(req,res));
        router.get('/competitions/:id', async (req,res) => await this.#get(req,res));
        router.post('/competitions',    async (req,res) => await this.#create(req,res));
    }

    async #create(req, res) {
        try {
            if (!req.body?.name) {
                return res.status(400).json({ error: "NAME_REQUIRED" });
            }

            const id = this._connector.getSafeDatabaseName(req.body.name);
            
            if (this._connector.isDatabaseExists(id)) {
                return res.status(409).json({ error: "EXIST_ERROR" });
            }

            const driver = await this._connector.getDatabase(id, req.body.name);          
                        
            const competition = await driver.models.race.create({"name": req.body.name})

            await this._connector.master.registerCompetition(
                req.body.name, 
                id + this._connector.constructor.DATABASE_EXTENSION,
                competition.id
            );

            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async #get(req,res){
        const compid = req.params.id;
        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Retrieve information for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }
    }

    async #list(req,res){
        const competitions = await this._connector.master.getAllCompetitions();
        res.json(competitions);
    }

}
