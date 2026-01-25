import { AnnexRankingManager, createAnnexFromJSON }   from "./AnnexRanking/AnnexRankingManager"
import { Stage, createStageFromJSON }                 from "./Stage"

export class RaceManager {

  #stages
  #annexrankings
  #annexrankingmanager

  constructor(stages = [new Stage()], annexrankingmanager = new AnnexRankingManager(), annexrankings = []){
    this.#stages              = stages;
    this.#annexrankings       = annexrankings;
    this.#annexrankingmanager = annexrankingmanager;
  }

  clone(){
    return new RaceManager(this.#stages, this.#annexrankingmanager, this.#annexrankings);
  }

  get nStages()       {return this.#stages.length;}
  get stages()        {return this.#stages;}
  get annexRankings() {return this.#annexrankings;}
  get annexTypes()    {return this.#annexrankingmanager.list;}
  
  addAnnexRanking(type,value){
    const ranking = this.#annexrankingmanager.build(type,this.#annexrankings.length + 1);
    ranking.priority = this.#annexrankings.length + 1;
    const data = this.clone();
    data.#annexrankings.push(ranking.update(value));
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

export function createRaceManagerFromJSON(data){

  const stages  = data.stages.map((s) => createStageFromJSON(s));

  const annexManager = new AnnexRankingManager();
  const annexes = annexManager.fromJSON(data.annex);
  return new RaceManager(stages, annexManager, annexes);

}
