
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

        if (!this._connector.isDatabaseExists(compid)){
            res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        } else {

            try {

                const race = await this._connector.master.findCompetition(compid);
                const raceId = race.id;
                const db = await this._connector.getDatabase(compid);
                const t = await db.transaction();

                let raceData = {};
                if (data.name){
                    raceData.name = data.name; 
                }
             
                // Stage
                // -----
                if (data.stages && data.stages.length > 0) {

                    await db.models.stage.destroy({
                        where: { raceId: raceId },
                        transaction: t
                    });
                    // Reset auto-increment for stage table
                    await db.query('DELETE FROM sqlite_sequence WHERE name="stage"', { transaction: t });
    
                    const stagesToCreate = data.stages.map(s => ({ ...s, raceId }));
                    raceData.nStages = data.stages.length;
                    await db.models.stage.bulkCreate(stagesToCreate, { transaction: t });
                }

                // Annexes
                // -------
                if (data.annex && data.annex.length > 0) {

                    await db.models.annex.destroy({
                        where: { raceId: raceId },
                        transaction: t
                    });
                    // Reset auto-increment for annex table
                    await db.query('DELETE FROM sqlite_sequence WHERE name="annex"', { transaction: t });

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
                    await db.models.annex.bulkCreate(annexesToCreate, { transaction: t, returning: true });
                }

                // Events
                // ------
                if (data.event && data.event.length > 0) {

                    await db.models.event.destroy({
                        where: {},
                        truncate: true,
                        cascade: false,
                        transaction: t
                    });
                    // Reset auto-increment for event table
                    await db.query('DELETE FROM sqlite_sequence WHERE name="event"', { transaction: t });
                
                    for (const e of data.event) {

                        const stage = await db.models.stage.findOne({
                            where: { name: e.stage },
                            transaction: t
                        });

                        // Annex
                        if (stage && e.annex && e.annex.length > 0) {

                            const grouped = e.annex.reduce((acc, item) => { 
                                acc[item.name] = acc[item.name] || []; 
                                acc[item.name].push(item); return acc; }
                                , {}); 
                                
                            const annexToCreate = Object.values(grouped).flatMap(group => { 
                                group.sort((a, b) => a.distance - b.distance); 
                                return group.map((item, index) => {
                                return {
                                    stageId: stage.id,
                                    annexId: item.name,
                                    type: 'annex',
                                    name: `${item.name}_${index + 1}`,
                                    distance: Number(item.distance),
                                    values: {category: item.category, points: item.points}
                                    }
                                }); 
                            });

                            await db.models.event.bulkCreate(annexToCreate, { transaction: t });
                        }

                        // Bonification
                        if (stage && e.bonification && e.bonification.length > 0) {

                            e.bonification.sort((a, b) => a.distance - b.distance); 
                            const bonifToCreate = e.bonification.map((item,index) => {
                                return {
                                    stageId: stage.id,
                                    type: 'bonification',
                                    name: `bonif_${index + 1}`,
                                    distance: Number(item.distance),item,
                                    values: {time: item.time}
                                };
                            });
                            await db.models.event.bulkCreate(bonifToCreate, { transaction: t });
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