import { Classification } from './References/Classification';
import { RaceManager }    from './Race/RaceManager';
import { RacerManager }   from './Racers/RacerManager'; 
import { RankingManager } from './Ranking/RankingManager';
import { RankingFactory } from './AnnexRanking/RankingFactory';

export class RaceModel {

  constructor() {
    this.racers_          = new RacerManager();
    this.ranking_         = new RankingManager();
    this.annex_           = [];
    this.classifications_ = new Classification();
    this.race_            = new RaceManager(this.annex_,new RankingFactory());
  }

  clone(){
    const model = new RaceModel();
    model.racers_           = this.racers_;
    model.ranking_          = this.ranking_;
    model.annex_            = this.annex_;
    model.race_             = this.race_;
    model.classifications_  = this.classifications_;
    return model;
  }

  getRacerManager() {
    return this.racers_;
  }
  
  getRace(){
    return this.race_;
  }

  updateRace(race){
    let data = this.clone();
    data.race_ = race;
    return data;
  }

  updateRacerManager(racerManager) {
    let data = this.clone();
    data.racers_ = racerManager;
    return data;
  }

  updateStageMain(stage,ranking){
    let data = this.clone();
    data.racers_.updateRanking(stage,ranking);
    return data;
  }

  getClassifications(){
    return this.classifications_;
  }

};


