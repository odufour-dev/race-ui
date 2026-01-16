
import Route from "./route.js"

export default class Configuration extends Route {

    register(router){
        router.get( '/competitions/:id/configuration',   async (req,res) => await this.#get(req,res));
        router.post('/competitions/:id/configuration',  async (req,res) => await this.#post(req,res));
    }

    async #get(req,res){

        const compid = req.params.id;
        
        if (!this._connector.isDatabaseExists(compid)){
            res.status(404).json({status: "notfound", message: "Database not found for " + compid});
            return;
        }
        
        try {
            const race = await this._connector.master.findCompetition(compid);
            const raceId = race.id;
            const db = await this._connector.getDatabase(compid);
            
            // Get race basic info
            const raceData = await db.models.race.findOne({
                where: { id: raceId }
            });
            
            // Get stages
            const stages = await db.models.stage.findAll({
                where: { raceId: raceId },
                order: [['id', 'ASC']]
            });
            
            // Get annexes
            const annexes = await db.models.annex.findAll({
                where: { raceId: raceId }
            });
            
            // Get events grouped by stage
            const events = await db.models.event.findAll({
                include: [{
                    model: db.models.stage,
                    as: 'stage',
                    where: { raceId: raceId },
                    attributes: ['id', 'name'],
                    required: true
                }],
                order: [['stageId', 'ASC']]
            });
            
            // Build event structure grouped by stage
            const eventsByStage = {};
            stages.forEach(s => {
                eventsByStage[s.name] = { annex: [], bonification: [] };
            });
            
            events.forEach(e => {
                const stageName = e.stage.name;
                if (e.type === 'annex') {
                    eventsByStage[stageName].annex.push({
                        name: annexes.find(a => a.id === e.annexId)?.name,
                        distance: e.distance,
                        category: e.values?.category,
                        points: e.values?.points
                    });
                } else if (e.type === 'bonification') {
                    eventsByStage[stageName].bonification.push({
                        distance: e.distance,
                        time: e.values?.time
                    });
                }
            });
            
            // Build response
            const response = {
                name: raceData.name,
                stages: stages.map(s => ({
                    name: s.name,
                    ...s.dataValues
                })),
                annex: annexes.map(a => ({
                    name: a.name,
                    type: a.type,
                    priority: a.priority,
                    ...a.options
                })),
                event: stages.map(s => ({
                    stage: s.name,
                    ...eventsByStage[s.name]
                }))
            };
            
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
                // Reset auto-increment for stage table
                await db.query('DELETE FROM sqlite_sequence WHERE name="stage"', { transaction: t });
    
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
                // Reset auto-increment for annex table
                await db.query('DELETE FROM sqlite_sequence WHERE name="annex"', { transaction: t });

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
                await db.models.event.destroy({
                    where: {},
                    truncate: true,
                    cascade: false,
                    transaction: t
                });
                // Reset auto-increment for event table
                await db.query('DELETE FROM sqlite_sequence WHERE name="event"', { transaction: t });

                if (data.event && data.event.length > 0) {
                    for (const e of data.event) {

                        const stage = await db.models.stage.findOne({
                            where: { name: e.stage },
                            transaction: t
                        });

                        // Annex
                        if (stage && e.annex && e.annex.length > 0 && annexMap) {

                            const grouped = e.annex.reduce((acc, item) => { 
                                acc[item.name] = acc[item.name] || []; 
                                acc[item.name].push(item); return acc; }
                                , {}); 
                                
                            const annexToCreate = Object.values(grouped).flatMap(group => { 
                                group.sort((a, b) => a.distance - b.distance); 
                                return group.map((item, index) => {
                                const annexId = annexMap.get(item.name);
                                return {
                                    stageId: stage.id,
                                    annexId,
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