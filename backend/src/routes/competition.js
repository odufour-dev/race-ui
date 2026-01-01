
import Route from "./route.js"

export default class Competition extends Route {

    register(router){
        router.get('/competitions',     (req,res) => this.#get(req,res));
        router.post('/competitions',    (req,res) => this.#create(req,res));
    }

    async #create(req,res){
        try {
            const id = await this._database.createCompetition(req.body.name);
            res.status(201).json({ id });
        } catch (e) {
            const code = e.message === "EXIST_ERROR" ? 409 : 500;
            res.status(code).json({ error: e.message });
        }
    }

    async #get(req,res){
        try {
            const competitions = await this._database.listCompetitions();
            res.json(competitions);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
