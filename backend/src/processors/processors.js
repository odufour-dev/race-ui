import { createRankingProcessor } from "./ranking.js";

class Processors {

    async extractRankingForStage(database,raceid,stageid){
        const proc = createRankingProcessor(database,raceid);
        return proc.getRankingForStage(stageid);
    }

    async updateRankingForStage(database,raceid,stageid,data){
        const proc = createRankingProcessor(database,raceid);
        return proc.insertRankingForStage(stageid,data);
    }

}

export default function createProcessors(){
    return new Processors();
}