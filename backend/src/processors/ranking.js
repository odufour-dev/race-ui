
class Ranking {

    #database
    #raceid

    constructor(database,raceid){
        this.#database = database;
        this.#raceid = raceid;
    }

    async getRankingForStage(stageid){

        // Get all stage results for this stage number
        const stageResults = await this.#database.models.stageresult.findAll({
            where: { stage: stageid },
            order: [['rank', 'ASC']]
        });

        // Get all registrations to map bib to racer
        const registrations = await this.#database.models.registration.findAll({
            where: { raceId: this.#raceid }
        });
        const registrationMap = new Map(registrations.map(reg => [reg.racerId, reg]));

        // Get all racers
        const racers = await this.#database.models.racer.findAll();

        // Get the stage definition to find finish line distance
        const stage = await this.#database.models.stage.findOne({
            where: { raceId: this.#raceid, number: stageid }
        });
        const stageDistance = stage ? stage.distance : null;

        // Get bonification data for stage finish (same distance as stage)
        let finishBonifications = [];
        if (stageDistance !== null && stageDistance !== undefined) {
            finishBonifications = await this.#database.models.event.findAll({
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

        // Helper function to get status from closest previous stage
        const getStatusFromPreviousStage = async (bib) => {
            const prevResult = await this.#database.models.stageresult.findOne({
                where: { stage: stageid-1, bib: bib }
            });
            if (prevResult && prevResult.status) {
                return prevResult.status;
            }
            return 'unknown';
        };

        // Build response with racer info and bonifications
        return await Promise.all(racers.map(async (r) => {
            const bib = registrationMap.get(r.id).bib;
            const res = stageResults.find((sr) => sr.bib === bib);
            let status = res ? res.status : null;
            
            // If no result for this stage, get status from closest previous stage
            if (!status) {
                const prevStatus = await getStatusFromPreviousStage(bib);
                if (prevStatus == "done"){status = "unknown"}
                else {status = "abs"}
            }
            
            const bonifications = (res && finishBonifications.length > 0 && res.rank > 0 && res.rank <= finishBonifications.length) ? finishBonifications[res.rank-1] : null;
            return {
                bib:            bib,
                firstName:      r.firstName,
                lastName:       r.lastName,
                team:           r.team,
                category:       r.category,
                ffcID:          r.ffcID,
                uciID:          r.uciID,
                rank:           res ? res.rank : 0,
                status:         status,
                time:           res ? res.time : 0,
                millis:         res ? res.millis : 0,
                bonification:   bonifications ?? 0
            };
        }));

    }

    async insertRankingForStage(stageNumber,data){

        const t = await this.#database.transaction();

        // Delete all previous results for this stage number
        await this.#database.models.stageresult.destroy({
            where: { stage: stageNumber },
            transaction: t
        });

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
        const results = await this.#database.models.stageresult.bulkCreate(
            data.map(r => ({
                bib: r.bib,
                rank: r.rank || 0,
                stage: stageNumber,
                status: (r.status && duplicateBibs.has(r.bib)) ? 'duplicate' : (r.status || 'unknown'),
                time: r.time,
                millis: 0
            })),
            { transaction: t }
        );

        await t.commit();
        return results;

    }

}

export function createRankingProcessor(database,raceid){
    return new Ranking(database,raceid);
}