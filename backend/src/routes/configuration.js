
import Route from "./route.js"

export default class Configuration extends Route {

    register(router){
        router.get( '/competitions/:id/configuration',   async (req,res) => await this.#get(req,res));
        router.post('/competitions/:id/configuration',  async (req,res) => await this.#post(req,res));
    }

    async #get(req,res){

        const compid = req.params.id;
        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Retrieve configuration for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

    async #post(req,res){

        const compid    = req.params.id;
        const data      = req.body;

        if (!this._connector.isDatabaseExists(compid)){
            res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        } else if (!("name" in data)) {
            res.status(500).json({status: "invalid", message: "Request body shall contain a 'name' field"});
        } else {

            try {

                const race = await this._connector.master.findCompetition(compid);
                const raceId = race.id;
                const db = await this._connector.getDatabase(compid);
                const t = await db.transaction();

                let raceData = { name: data.name };
             
                // Stage
                // -----
                await db.models.stage.destroy({
                    where: { raceId: raceId },
                    transaction: t
                });
    
                if (data.stages && data.stages.length > 0) {
                    const stagesToCreate = data.stages.map(s => ({ ...s, raceId }));
                    raceData.nStages = data.stages.length;
                    await db.models.stage.bulkCreate(stagesToCreate, { transaction: t });
                }

                // Annexes
                // -------
                await db.models.annex.destroy({
                    where: { raceId: raceId },
                    transaction: t
                });

                let annexMap = {};
                if (data.annex && data.annex.length > 0) {
                    const annexesToCreate = data.annex.map(item => {
                        const { name, type, priority, ...rest } = item;
                        return {
                            name,
                            raceId,
                            type,
                            priority,
                            options: rest
                        };
                    });
                    const annexes = await db.models.annex.bulkCreate(annexesToCreate, { transaction: t, returning: true });
                    annexMap = new Map(annexes.map(a => [a.name, a.id]));
                }

                // Events
                // ------
                console.log("STARTING EVENTS DELETION");
                await db.models.event.destroy({
                    where: {},
                    truncate: true,
                    cascade: false,
                    transaction: t
                });

                if (data.event && data.event.length > 0) {
                    for (const e of data.event) {

                        const stage = await db.models.stage.findOne({
                            where: { name: e.stage },
                            transaction: t
                        });

                        if (stage && e.annex && e.annex.length > 0 && annexMap) {

                            const eventToCreate = e.annex.map(a => {
                                const annexId = annexMap.get(a.name);
                                return {
                                    stageId: stage.id,
                                    annexId,
                                    distance: Number(a.distance),
                                    points: a.points
                                };
                            });
                            await db.models.event.bulkCreate(eventToCreate, { transaction: t });
                        }
                    }
                }

                // Race
                // ----
                await db.models.race.update(
                    raceData,
                    { where: { id: raceId }, transaction: t }
                );

                await t.commit();

                res.status(201).json({status: "ok"});
                
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
            
        }

    }

}