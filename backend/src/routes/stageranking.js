import Route from "./route.js"

export default class StageRanking extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/rankings',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/stages/:stageId/rankings',  (req,res) => this.#post(req,res));
    }

    async #get(req,res){

        const compid  = req.params.id;
        const stageNumber = parseInt(req.params.stageId, 10);

        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}
            
            const results = await this._processor.extractRankingForStage(competition.database,competition.raceId,stageNumber);

            res.status(200).json({
                stage: stageNumber,
                results: results.map((r) => ({...r,time: this._time.formatHMS(r.time)}))
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async #post(req,res){

        const data          = req.body;
        const compid        = req.params.id;
        const stageNumber   = parseInt(req.params.stageId, 10);

        // Validate input - expect array directly
        if (!Array.isArray(data) || data.length === 0) {
            return res.status(400).json({status: "invalid", message: "Request body must be an array with at least one result"});
        }

        try {

            const competition = await this._connector.getCompetition(compid);
            if (!competition){return res.status(404).json({status: "notfound", message: "Database not found for " + compid});}
            
            const results = await this._processor.updateRankingForStage(competition.database,competition.raceId,stageNumber,data.map((d) => ({...d, time:this._time.parseHMS(d.time)})));

            res.status(201).json({
                status: "success",
                stage: stageNumber,
                resultsCount: results.length
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

}
