
import Route from "./route.js"

export default class Racer extends Route {

    register(router){
        router.post('/:competition/racers/sync',  (req,res) => this.#sync(req,res));
    }

    async #sync(req,res){
        /*
       try {
            this._database.syncRacers(req.params.competition, req.body.racers);
            res.json({ message: "OK" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
        */
       res.status(500).json({ error: 'Route not implemented' });
    }

}
