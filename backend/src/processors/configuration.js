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
            eventsByStage[s.number] = { annex: [], bonification: [] };
        });
        
        events.forEach(e => {
            const stageNumber = e.stageId;
            if (e.type === 'annex') {
                eventsByStage[stageNumber].annex.push({
                    name: annexes.find(a => a.id === e.annexId)?.name,
                    distance: e.distance,
                    category: e.values?.category,
                    points: e.values?.points
                });
            } else if (e.type === 'bonification') {
                eventsByStage[stageNumber].bonification.push({
                    distance: e.distance,
                    time: e.values?.time
                });
            }
        });
        
        const configuration = {
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
                ...eventsByStage[s.number]
            }))
        };
        return configuration;

    }

    async getConfigurationForStage(stageid){

        // Get annexes
        const annexes = await this.#database.models.annex.findAll({
            where: { raceId: this.#raceid }
        });
        
        // Get events grouped by stage
        const events = await this.#database.models.event.findAll({
            where: { stageId: stageid }
        });

       return events.map((e) => ({
                name:       e.type === 'bonification' ? "bonification" : annexes.find(a => a.id === e.annexId)?.name,
                distance:   e.distance,
                category:   e.type === 'bonification' ? "bonification" : e.values?.category,
                values:     e.type === 'bonification' ? e.values?.time : e.values?.points
            })
        );

    }

}

export function createConfigurationProcessor(database,raceid){
    return new Configuration(database,raceid);
}