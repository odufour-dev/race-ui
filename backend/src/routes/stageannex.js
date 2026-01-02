
import Route from "./route.js"

export default class StageAnnex extends Route {

    register(router){
        router.get( '/competitions/:id/stages/:stageId/annexes/:annexId',  (req,res) => this.#get(req,res));
        router.post('/competitions/:id/stages/:stageId/annexes/:annexId',  (req,res) => this.#post(req,res));
    }

    async #get(req,res){

        const compid  = req.params.id;
        const annexid = req.params.annexId;
        const stageid = req.params.stageId;

        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Retrieve stage #" + stageid + " ranking '" + annexid + "' for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

    async #post(req,res){

        const compid  = req.params.id;
        const annexid = req.params.annexId;
        const stageid = req.params.stageId;

        if (this._connector.isDatabaseExists(compid)){
            res.status(200).json("TODO : Update stage #" + stageid + " ranking '" + annexid + "' for database : " + compid);
        } else {
            res.status(404).json("Database not found for " + compid);
        }

    }

}
