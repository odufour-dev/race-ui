class Configuration {

    #database
    #raceid

    constructor(database,raceid){
        this.#database = database;
        this.#raceid = raceid;
    }

    async getConfiguration(){

        // Get race basic info
        const raceData = await this.#database.models.race.findOne({
            where: { id: this.#raceid }
        });
        
        // Get stages
        const stages = await this.#database.models.stage.findAll({
            where: { raceId: this.#raceid },
            order: [['id', 'ASC']]
        });
        
        // Get annexes
        const annexes = await this.#database.models.annex.findAll({
            where: { raceId: this.#raceid }
        });
        
        // Get events grouped by stage
        const events = await this.#database.models.event.findAll({
            order: [['stageId', 'ASC']]
        });
        
        // Build event structure grouped by stage
        const eventsByStage = {};
        stages.forEach(s => {
            eventsByStage[s.number] = [];
        });
        
        events.forEach(e => {
            const stageNumber = e.stageId;
            eventsByStage[stageNumber].push({
                id:         e.annexId,
                name:       e.name,                    
                distance:   e.distance,
                category:   e.category,
                type:       e.type,
                values:     e.values
            });
        });
        
        const configuration = {
            name: raceData.name,
            stages: stages.map(s => ({
                name: s.name,
                ...s.dataValues,
                events: eventsByStage[s.number]
            })),
            annex: annexes.map(a => ({
                name: a.name,
                type: a.type,
                priority: a.priority,
                ...a.options
            }))
        };
        return configuration;

    }

    async getConfigurationForStage(stageid){

        // Get annexes
        const annexes = await this.#database.models.annex.findAll({
            where: { raceId: this.#raceid }
        });
        
        // Get events grouped by stageextractConfiguration
        const events = await this.#database.models.event.findAll({
            where: { stageId: stageid }
        });

       return events.map(e => ({
            id:         e.annexId,
            name:       e.name,                    
            distance:   e.distance,
            category:   e.category,
            type:       e.type,
            values:     e.values
        }));

    }

    async insertConfiguration(data){

        const t = await this.#database.transaction();

        let raceData = {};
        if (data.name){
            raceData.name = data.name; 
        }
        
        // Stage
        // -----
        if (data.stages && data.stages.length > 0) {

            await this.#database.models.stage.destroy({
                where: { raceId: this.#raceid },
                transaction: t
            });
            // Reset auto-increment for stage table
            await this.#database.query('DELETE FROM sqlite_sequence WHERE name="stage"', { transaction: t });

            const stagesToCreate = data.stages.map(s => ({ ...s, raceId:this.#raceid }));
            raceData.nStages = data.stages.length;
            await this.#database.models.stage.bulkCreate(stagesToCreate, { transaction: t });
        }

        // Annexes
        // -------
        if (data.annex && data.annex.length > 0) {

            await this.#database.models.annex.destroy({
                where: { raceId: this.#raceid },
                transaction: t
            });
            // Reset auto-increment for annex table
            await this.#database.query('DELETE FROM sqlite_sequence WHERE name="annex"', { transaction: t });

            const annexesToCreate = [];
            data.annex.map((item) => {
                const common = {name: item.name, type: item.type, priority: item.priority ?? 0};
                if ("options" in item){
                    annexesToCreate.push({...common, options: item.options});
                } else if ("categories" in item){
                    item.categories.map((c) => {
                        annexesToCreate.push({...common, category: c.name, options: c.values});
                    })
                }
            });
            await this.#database.models.annex.bulkCreate(annexesToCreate, { transaction: t, returning: true });
        }

        // Events
        // ------
        if (data.event && data.event.length > 0) {

            await this.#database.models.event.destroy({
                where: {},
                truncate: true,
                cascade: false,
                transaction: t
            });
            // Reset auto-increment for event table
            await this.#database.query('DELETE FROM sqlite_sequence WHERE name="event"', { transaction: t });
        
            for (const e of data.event) {

                const stage = await this.#database.models.stage.findOne({
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
                            stageId:    stage.id,
                            annexId:    `${item.name}_${index + 1}`,
                            type:       item.type,
                            name:       item.name,
                            distance:   Number(item.distance),
                            category:   item.category,
                            values:     item.values
                            }
                        }); 
                    });

                    await this.#database.models.event.bulkCreate(annexToCreate, { transaction: t });
                }

            }
        }

        // Race
        // ----
        await this.#database.models.race.update(
            raceData,
            { where: { id: this.#raceid }, transaction: t }
        );

        await t.commit();

        return {status: "ok"};

    }

}

export function createConfigurationProcessor(database,raceid){
    return new Configuration(database,raceid);
}