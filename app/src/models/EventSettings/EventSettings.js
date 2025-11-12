import { RankingFactory } from "../AnnexRanking/RankingFactory";
import { Stage } from "../Stage/Stage"

export class EventSettings {

  constructor(stages = [new Stage()], annexrankings = [], rankingfactory = new RankingFactory()){
    this.stages_ = stages;
    this.annexrankings_ = annexrankings;
    this.rankingfactory_ = rankingfactory;
  }

  get nStages(){
    return this.stages_.length;
  }
  get stages(){
    return this.stages_;
  }
  get annexRankings(){
    return this.annexrankings_;
  }
  get annexRankingTypes(){
    return this.rankingfactory_.list;
  }

  addAnnexRanking(type,id){
    const ranking = this.rankingfactory_.build(type,id);
    ranking.priority = this.annexrankings_.length + 1;
    this.annexrankings_.push(ranking);
    return this.clone();
  }

  addStage(){
    const stage = new Stage(this.stages_.length + 1);
    this.stages_.push(stage);
    return this.clone();
  }

  clone(){
    return new EventSettings(this.stages_, this.annexrankings_, this.rankingfactory_);
  }

  update(settings){

    let data = this.clone();
    if (settings.stages){
      data.stages_ = settings.stages.map((s,idx) => {
        const stage = new Stage(s.id ?? idx+1);
        return stage.update(s);
      });
    }

    if (settings.annexRankings){
        data.annexrankings_ = settings.annexRankings.map((r) => {
            const ranking = data.rankingfactory_.build(r.type,r.id);
            return ranking.update(r);
        })
    }
    return data;
  }

}