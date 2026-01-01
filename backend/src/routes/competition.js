
import Route from "./route.js"

export default class Competition extends Route {

    register(router){
        router.get('/competitions',     async (req,res) => await this.#get(req,res));
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

            const driver = this._connector.getDatabase(id);
            const competition = this._connector.competitions.create(driver, req.body.name);            
            await driver.sync();
            
            await this._connector.master.registerCompetition(
                req.body.name, 
                id + this._connector.constructor.DATABASE_EXTENSION
            );

            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: "INTERNAL_ERROR" });
        }
    }

    async #get(req,res){
        const competitions = await this._connector.master.getAllCompetitions();
        res.json(competitions);
    }

}
