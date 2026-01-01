
import Route from "./route.js"

export default class Competition extends Route {

    register(router){
        router.get('/competitions',     (req,res) => this.#get(req,res));
        router.post('/competitions',    (req,res) => this.#create(req,res));
    }

    async #create(req,res) {
    
        const id = this._connector.getSafeDatabaseName(req.body.name);
        if (this._connector.isDatabaseExists(id)){
            res.status(409).json({ error: "EXIST_ERROR" });
        } else {       
            
            const driver = this._connector.getDatabase(id);
            const competition = this._connector.competitions.create(driver,req.body.name);
            await driver.sync();
            // TODO : Insert meta-data in competition database
            
            await this._connector.master.registerCompetition(req.body.name, id + this._connector.DATABASE_EXTENSION);
            res.status(201).json({ id });
        
        }

    }

    async #get(req,res){
        const competitions = await this._connector.master.getAllCompetitions();
        res.json(competitions);
    }

}
