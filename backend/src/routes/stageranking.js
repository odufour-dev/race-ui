
import Route from "./route.js"

export default class StageRanking extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/rankings',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/stages/:stageId/rankings',  (req,res) => this.#post(req,res));
    }

    async #get(req,res){

        const compid  = req.params.id;
        const stageNumber = parseInt(req.params.stageId, 10);

        if (!this._connector.isDatabaseExists(compid)){
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }

        try {
            const race = await this._connector.master.findCompetition(compid);
            const raceId = race.id;
            const db = await this._connector.getDatabase(compid);

            // Get all stage results for this stage number
            const stageResults = await db.models.stageresult.findAll({
                where: { stage: stageNumber },
                order: [['rank', 'ASC']]
            });

            if (stageResults.length === 0) {
                return res.status(404).json({status: "notfound", message: "No results found for stage " + stageNumber});
            }

            // Get all registrations to map bib to racer
            const registrations = await db.models.registration.findAll({
                where: { raceId: raceId }
            });
            const registrationMap = new Map(registrations.map(reg => [reg.bib, reg]));

            // Get all racers
            const racers = await db.models.racer.findAll();
            const racerMap = new Map(racers.map(r => [r.id, r]));

            // Get the stage definition to find finish line distance
            const stage = await db.models.stage.findOne({
                where: { raceId: raceId, number: stageNumber }
            });
            const stageDistance = stage ? stage.distance : null;

            // Get bonification data for stage finish (same distance as stage)
            let finishBonifications = [];
            if (stageDistance !== null && stageDistance !== undefined) {
                finishBonifications = await db.models.event.findAll({
                    where: {
                        stageId: stage ? stage.id : null,
                        distance: stageDistance,
                        type: 'bonification'
                    }
                });
                if (finishBonifications.length > 0 && finishBonifications[0].values.time) {
                    finishBonifications = finishBonifications[0].values.time;
                }
            }

            // Build response with racer info and bonifications
            const results = stageResults.map(result => {
                const registration = registrationMap.get(result.bib);
                const racer = registration ? racerMap.get(registration.racerId) : null;

                const resultObj = {
                    bib:    result.bib,
                    rank:   result.rank,
                    status: result.status,
                    time:   result.time,
                    millis: result.millis
                };

                // Add bonifications if available
                if (finishBonifications.length > 0 && result.rank > 0 && result.rank <= finishBonifications.length) {
                    resultObj.bonification = finishBonifications[result.rank-1]
                } else {
                    resultObj.bonification = null;
                }

                // Add racer information if available
                if (racer) {
                    resultObj.racer = {
                        firstName: racer.firstName,
                        lastName: racer.lastName,
                        team: racer.team,
                        category: racer.category,
                        ffcID: racer.ffcID,
                        uciID: racer.uciID,
                        sex: racer.sex
                    };
                }

                return resultObj;
            });

            res.status(200).json({
                stage: stageNumber,
                distance: stageDistance,
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
