
import Route from "./route.js"

export default class Competition extends Route {

    register(router){
        router.get('/competitions',     async (req,res) => await this.#list(req,res));
        router.get('/competitions/:id', async (req,res) => await this.#get(req,res));
        router.post('/competitions',    async (req,res) => await this.#create(req,res));
    }

    async #create(req, res) {
        try {
            if (!req.body?.name) {
                return res.status(400).json({ error: "NAME_REQUIRED" });
            }

            const id = this._connector.getSafeDatabaseName(req.body.name);
            
            if (this._connector.isDatabaseExists(id)) {
                return res.status(409).json({ error: "EXIST_ERROR" });
            }

            const driver = await this._connector.getDatabase(id, req.body.name);          
                        
            const competition = await driver.models.race.create({"name": req.body.name})

            await this._connector.master.registerCompetition(
                req.body.name, 
                id + this._connector.constructor.DATABASE_EXTENSION,
                competition.id
            );

            res.status(201).json({ id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async #get(req, res) {
        const compid = req.params.id;
        
        if (!this._connector.isDatabaseExists(compid)) {
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }
        
        try {
            const race = await this._connector.master.findCompetition(compid);
            const raceId = race.id;
            const db = await this._connector.getDatabase(compid);
            
            // Get race basic info
            const raceData = await db.models.race.findOne({
                where: { id: raceId }
            });
            
            // Get stages with results
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
            
            // Build configuration (same format as GET configuration route)
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
                    ...eventsByStage[s.name]
                }))
            };
            
            // Get racers
            const racers = await db.models.racer.findAll({
                order: [['id', 'ASC']]
            });
            
            // Get registrations for the race
            const registrations = await db.models.registration.findAll({
                where: { raceId: raceId }
            });
            
            // Create a map of racerId to bib
            const bibMap = new Map(registrations.map(reg => [reg.racerId, reg.bib]));
            
            // Get stage results
            const stageResults = {};
            for (const stage of stages) {
                const results = await db.models.result.findAll({
                    where: { stageId: stage.id },
                    include: [{
                        model: db.models.racer,
                        as: 'racer',
                        attributes: ['id', 'firstName', 'lastName']
                    }],
                    order: [['rank', 'ASC']]
                });
                stageResults[stage.name] = results.map(r => ({
                    racerId: r.racerId,
                    racer: r.racer ? `${r.racer.firstName} ${r.racer.lastName}` : null,
                    rank: r.rank,
                    time: r.time,
                    points: r.points
                }));
            }
            
            // Build complete response
            const response = {
                id: compid,
                name: raceData.name,
                description: raceData.description || '',
                configuration: configuration,
                racers: racers.map(r => ({
                    id: r.id,
                    firstName: r.firstName,
                    lastName: r.lastName,
                    team: r.team,
                    category: r.category,
                    ffcID: r.ffcID,
                    uciID: r.uciID,
                    sex: r.sex,
                    bib: bibMap.get(r.id) || null
                })),
                results: stageResults
            };
            
            res.status(200).json(response);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async #list(req,res){
        const competitions = await this._connector.master.getAllCompetitions();
        res.json(competitions);
    }

}
