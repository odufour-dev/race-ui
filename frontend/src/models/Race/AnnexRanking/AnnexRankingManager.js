
import { Bonifications } from "./Bonifications";
import { FilterRanking } from "./FilterRanking";
import { PointsRanking } from "./PointsRanking";
import { TeamRanking }   from "./TeamRanking";

export class AnnexRankingManager {

    #mapping

    constructor(){
        this.#mapping = {
            "bonification": (id) => new Bonifications(id,   "points"),
            "points":       (id) => new PointsRanking(id,   "points"),
            "team":         (id) => new TeamRanking(id,     "team"),
            "filter":       (id) => new FilterRanking(id,   "filter"),
        };
    }

    clone(){
        return new AnnexRankingManager();
    }

    get list(){
        return Object.keys(this.#mapping);
    }

    build(type,id){
        return this.#mapping[type](id);
    }

    fromJSON(data){
        
        return data.map( (annexData) => {
            const ranking = this.build(annexData.type, annexData.name);
            return ranking.update(annexData);
        });

    }

}

