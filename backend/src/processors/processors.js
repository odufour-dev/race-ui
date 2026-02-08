import { createConfigurationProcessor } from "./configuration.js";
import { createRankingProcessor }       from "./ranking.js";

class Processors {

    async extractConfiguration(database,raceid){
        const proc = createConfigurationProcessor(database,raceid);
        return proc.getConfiguration();
    }

    async extractConfigurationForStage(database,raceid,stageid){
        const proc = createConfigurationProcessor(database,raceid);
        return proc.getConfigurationForStage(stageid);
    }

    async extractRankingForStage(database,raceid,stageid){
        const proc = createRankingProcessor(database,raceid);
        return proc.getRankingForStage(stageid);
    }

    async insertConfiguration(database,raceid,data){
        const proc = createConfigurationProcessor(database,raceid);
        return proc.insertConfiguration(data);
    }

    async updateRankingForStage(database,raceid,stageid,data){
        const proc = createRankingProcessor(database,raceid);
        return proc.insertRankingForStage(stageid,data);
    }

}

export default function createProcessors(){
    return new Processors();
}