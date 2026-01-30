
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
            const results = await this._processor.extractRankingForStage(competition.database,competition.raceId,stageNumber);

            res.status(200).json({
                stage: stageNumber,
                results: results
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async #post(req,res){

        const compid  = req.params.id;
        const stageNumber = parseInt(req.params.stageId, 10);

        if (!this._connector.isDatabaseExists(compid)){
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }

        try {
            const db = await this._connector.getDatabase(compid);
            const t = await db.transaction();

            const data = req.body;

            // Validate input - expect array directly
            if (!Array.isArray(data) || data.length === 0) {
                return res.status(400).json({status: "invalid", message: "Request body must be an array with at least one result"});
            }

            // Delete all previous results for this stage number
            await db.models.stageresult.destroy({
                where: { stage: stageNumber },
                transaction: t
            });

            // Convert time string (HH:MM:SS) to seconds (integer)
            const convertTimeToSeconds = (timeStr) => {
                if (!timeStr) return 0;
                const parts = timeStr.split(':');
                if (parts.length !== 3) return 0;
                const hours = parseInt(parts[0], 10);
                const minutes = parseInt(parts[1], 10);
                const seconds = parseInt(parts[2], 10);
                return hours * 3600 + minutes * 60 + seconds;
            };

            // Check for duplicate bibs and mark them
            const bibMap = new Map();
            const duplicateBibs = new Set();
            
            data.forEach(r => {
                if (bibMap.has(r.bib)) {
                    duplicateBibs.add(r.bib);
                } else {
                    bibMap.set(r.bib, true);
                }
            });

            // Create stage results
            const results = await db.models.stageresult.bulkCreate(
                data.map(r => ({
                    bib: r.bib,
                    rank: r.rank || 0,
                    stage: stageNumber,
                    status: (r.status && duplicateBibs.has(r.bib)) ? 'duplicate' : (r.status || 'unknown'),
                    time: convertTimeToSeconds(r.time),
                    millis: 0
                })),
                { transaction: t }
            );

            await t.commit();

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
