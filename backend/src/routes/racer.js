
import Route from "./route.js"

export default class Racer extends Route {

    register(router){
        router.get( '/competitions/:id/racers',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/racers',  (req,res) => this.#post(req,res));
    }

    async #get(req,res){

        const compid = req.params.id;
        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Retrieve racers for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

    async #post(req,res){

        const compid = req.params.id;
        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Update racers for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

}
