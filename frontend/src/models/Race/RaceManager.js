import { Stage, createStageFromJSON } from "./Stage"

export class RaceManager {

  #stages
  #annexrankings

  constructor(stages = [new Stage()], annexrankings = []){
    this.#stages = stages;
    this.#annexrankings = annexrankings;
  }

  clone(){
    return new RaceManager(this.#stages, this.#annexrankings);
  }

  get nStages(){
    return this.#stages.length;
  }
  get stages(){
    return this.#stages;
  }
  get annexRankings(){
    return this.#annexrankings;
  }
  
  addAnnexRanking(ranking){
    ranking.priority = this.#annexrankings.length + 1;
    const data = this.clone();
    data.#annexrankings.push(ranking);
    return data;
  }

  addStage(){    
    const stage = new Stage(this.#stages.length + 1);
    const data = this.clone();
    data.#stages.push(stage);
    return data.clone();
  }  

  update(settings, annexRankings){

    let data = this.clone();
    if (settings.stages){
      data.#stages = settings.stages.map((s,idx) => {
        const stage = new Stage(s.id ?? idx+1);
        return stage.update(s);
      });
    }
    if (annexRankings !== undefined){
      data.#annexrankings = annexRankings;
    }
    return data;
  }

}
