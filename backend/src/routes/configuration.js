
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

        const compid = req.params.id;
        if (this._connector.isDatabaseExists(compid)){

            const db = this._connector.getDatabase(compid);
            const data = req.body;

            try {

                const result = await db.transaction(async (t) => {
                    
                    const existingRace = await db.models.race.findOne({ 
                        where: { name: data.name }, 
                        transaction: t 
                    });

                    if (existingRace) {
                        await existingRace.destroy({ transaction: t });
                    }

                    /*
                    const annexesToInsert = rawData.map(item => {
                    const { name, type, priority, ...rest } = item;
                    return {
                        name,
                        type,
                        priority,
                        options: rest // Tout ce qui n'est pas name/type/priority va dans options
                    };
                    });
                    */

                    const raceData = {
                        name: data.name,
                        nStages: data.stages.length,
                        Stages: data.stages
                    };

                    return await db.models.race.create(raceData, {
                        include: [{ model: db.models.stage, as: 'Stages' }],
                        transaction: t 
                    });
                });

                res.status(201).json(result);
                
            } catch (error) {
                res.status(500).json({ error: error.message });
            }

        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

}