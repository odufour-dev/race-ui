import { createStageRankingProcessor } from "./StageRanking.js";

class Processors {

    async extractRankingForStage(database,raceid,stageid){
        const proc = createStageRankingProcessor(database,raceid);
        return proc.getRankingForStage(stageid);
    }

}


export default function createProcessors(){
    return new Processors();
}