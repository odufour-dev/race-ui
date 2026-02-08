
import Route from "./route.js"

export default class Configuration extends Route {

    register(router){
        router.get( '/competitions/:id/configuration',   async (req,res) => await this.#get(req,res));
        router.post('/competitions/:id/configuration',  async (req,res) => await this.#post(req,res));
    }

    async #get(req,res){

        const compid = req.params.id;
        const stage  = req.query.stage;
        
        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}
            
            const response = stage ? 
                await this._processor.extractConfigurationForStage(competition.database,competition.raceId,stage) :
                await this._processor.extractConfiguration(competition.database,competition.raceId);

            res.status(200).json(response);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async #post(req,res){

        const compid    = req.params.id;
        const data      = req.body;

        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}

            const response = await this._processor.insertConfiguration(competition.database,competition.raceId,data);
            res.status(200).json(response);

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

}