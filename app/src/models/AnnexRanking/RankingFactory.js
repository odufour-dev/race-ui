import { FilterRanking } from "./FilterRanking"
import { PointsRanking } from "./PointsRanking";
import { TeamRanking } from "./TeamRanking";

export class RankingFactory {

    constructor(){
        this.mapping_ = {
            "points":   (id) => new PointsRanking(id, "points"),
            "team":     (id) => new TeamRanking(id, "team"),
            "filter":   (id) => new FilterRanking(id, "filter"),
        };
    }

    get list(){
        return Object.keys(this.mapping_);
    }

    build(type,id){
        return this.mapping_[type](id);
    }

}