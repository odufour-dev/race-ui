import { Stage } from "./Stage"

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
    this.#annexrankings.push(ranking);
    return this.clone();
  }

  addStage(){
    const stage = new Stage(this.#stages.length + 1);
    this.#stages.push(stage);
    return this.clone();
  }  

  update(settings){

    let data = this.clone();
    if (settings.stages){
      data.#stages = settings.stages.map((s,idx) => {
        const stage = new Stage(s.id ?? idx+1);
        return stage.update(s);
      });
    }
/*
    if (settings.annexRankings){
        data.#annexrankings = settings.annexRankings.map((r) => {
            const ranking = data.#rankingfactory.build(r.type,r.id);
            return ranking.update(r);
        })
    }
*/
    return data;
  }

}