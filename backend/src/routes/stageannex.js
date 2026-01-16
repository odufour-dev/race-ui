
import Route from "./route.js"

export default class StageAnnex extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/annexes',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/stages/:stageId/annexes',  (req,res) => this.#post(req,res));
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

            // Get all annex results for this annex and stage
            const annexResults = await db.models.annexresult.findAll({
                where: { 
                    stage: stageNumber
                },
                order: [['rank', 'ASC']]
            });

            if (annexResults.length === 0) {
                return res.status(404).json({status: "notfound", message: "No results found for annex '" + annexid + "' at stage " + stageNumber});
            }

            // Get all registrations to map bib to racer
            const registrations = await db.models.registration.findAll({
                where: { raceId: raceId }
            });
            const registrationMap = new Map(registrations.map(reg => [reg.bib, reg]));

            // Get all racers
            const racers = await db.models.racer.findAll();
            const racerMap = new Map(racers.map(r => [r.id, r]));

            // Build response with racer info
            const results = annexResults.map(result => {
                const registration = registrationMap.get(result.bib);
                const racer = registration ? racerMap.get(registration.racerId) : null;

                const resultObj = {
                    bib:    result.bib,
                    rank:   result.rank,
                    points: result.points
                };

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
                results: results
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

    async #post(req,res){

        const compid  = req.params.id;
        const stageid = parseInt(req.params.stageId, 10);

        if (!this._connector.isDatabaseExists(compid)){
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }

        try {
            const db = await this._connector.getDatabase(compid);
            const t = await db.transaction();

            const data = req.body;

            // Validate input - expect ranking array
            if (!Array.isArray(data) || data.length === 0) {
                return res.status(400).json({status: "invalid", message: "Request body must be an array with at least one result"});
            }

            // Delete all previous results for this annex at this stage
            await db.models.annexresult.destroy({
                where: { 
                    stage: stageid
                },
                transaction: t
            });
            
            const annexResults = [];
            data.map((annex) => {
                if (!("name" in annex)) {
                    throw new Error("Each annex result must contain a 'name' field");
                }
                const annexName = annex.name;
                annex.results.map((result) => {
                    if (!("bib" in result) || !("rank" in result) || !("points" in result)) {
                        throw new Error("Each result must contain 'bib', 'rank', and 'points' fields");
                    }
                    annexResults.push({
                        bib:    result.bib,
                        rank:   result.rank,
                        stage:  stageid,
                        annex:  annexName,
                        points: result.points
                    });
                });
            });

            // Create annex results
            const results = await db.models.annexresult.bulkCreate(annexResults,{ transaction: t });
            await t.commit();

            res.status(201).json({
                status:         "success",
                stage:          stageid,
                resultsCount:   results.length
            });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }

    }

}
