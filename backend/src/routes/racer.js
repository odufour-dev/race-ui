
import Route from "./route.js"

export default class Racer extends Route {

    register(router){
        router.get( '/competitions/:id/racers',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/racers',  (req,res) => this.#post(req,res));
    }

    async #get(req,res){
        const compid = req.params.id;
        
        if (!this._connector.isDatabaseExists(compid)){
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }
        
        try {
            const race = await this._connector.master.findCompetition(compid);
            const raceId = race.id;
            const db = await this._connector.getDatabase(compid);
            
            // Get all registrations for this race
            const registrations = await db.models.registration.findAll({
                where: { raceId: raceId },
                order: [['bib', 'ASC']]
            });
            
            // Get all racers
            const racers = await db.models.racer.findAll();
            
            // Create a map of racer id to racer data
            const racerMap = new Map(racers.map(r => [r.id, r]));
            
            // Build response in the same format as the input
            const response = {
                racers: registrations.map(reg => {
                    const racer = racerMap.get(reg.racerId);
                    return {
                        id: racer.id,
                        firstName: racer.firstName,
                        lastName: racer.lastName,
                        team: racer.team,
                        category: racer.category,
                        ffcID: racer.ffcID,
                        uciID: racer.uciID,
                        sex: racer.sex,
                        bib: reg.bib
                    };
                })
            };
            
            res.status(200).json(response);
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async #post(req,res){
        const compid = req.params.id;
        
        if (!this._connector.isDatabaseExists(compid)){
            return res.status(404).json({status: "notfound", message: "Database not found for " + compid});
        }
        
        try {
            const race = await this._connector.master.findCompetition(compid);
            const raceId = race.id;
            const db = await this._connector.getDatabase(compid);
            const t = await db.transaction();
            
            const data = req.body;
            
            if (!Array.isArray(data.racers) || data.racers.length === 0) {
                return res.status(400).json({status: "invalid", message: "Request body must contain 'racers' array with at least one racer"});
            }
            
            // Delete existing racers and registrations for this race
            await db.models.registration.destroy({
                where: { raceId: raceId },
                transaction: t
            });
            await db.models.racer.destroy({
                where: {},
                truncate: true,
                cascade: false,
                transaction: t
            });
            // Reset auto-increment for racer table
            await db.query('DELETE FROM sqlite_sequence WHERE name="racer"', { transaction: t });
            // Reset auto-increment for registration table
            await db.query('DELETE FROM sqlite_sequence WHERE name="registration"', { transaction: t });
            
            // Create racers and registrations
            const createdRacers = await db.models.racer.bulkCreate(
                data.racers.map(r => ({
                    firstName: r.firstName || null,
                    lastName: r.lastName || null,
                    team: r.team || null,
                    category: r.category || null,
                    ffcID: r.ffcID || null,
                    uciID: r.uciID || null,
                    sex: r.sex || null
                })),
                { transaction: t, returning: true }
            );
            
            // Create registrations with bib numbers
            const registrationsToCreate = createdRacers.map((racer, index) => {
                const originalRacer = data.racers[index];
                return {
                    raceId: raceId,
                    racerId: racer.id,
                    bib: originalRacer.bib || null
                };
            });
            
            await db.models.registration.bulkCreate(registrationsToCreate, { transaction: t });
            
            await t.commit();
            
            res.status(201).json({status: "ok", message: `${createdRacers.length} racers registered successfully`});
            
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}
