import { Classification } from './References/Classification';
import { RaceManager }    from './Race/RaceManager';
import { RacerManager }   from './Racers/RacerManager'; 
import { RankingManager } from './Ranking/RankingManager';
import { RankingFactory } from './AnnexRanking/RankingFactory';

export class RaceModel {

  constructor() {
    this.racers_          = new RacerManager();
    this.annex_           = [];
    this.classifications_ = new Classification();
    this.race_            = new RaceManager(this.annex_,new RankingFactory());
    this.ranking_         = new RankingManager();
  }

  clone(){
    const model = new RaceModel();
    model.racers_           = this.racers_.clone();
    model.ranking_          = this.ranking_.clone();
    model.annex_            = this.annex_;
    model.race_             = this.race_.clone();
    model.classifications_  = this.classifications_;
    return model;
  }

  getClassifications(){
    return this.classifications_;
  }

  getRace(){
    return this.race_;
  }

  getRacerManager() {
    return this.racers_;
  }
    
  getStageRanking(stage){
    this.ranking_.Bibs  = this.racers_.getAll().map((r) => r.id);
    this.ranking_.Stage = stage;
    return this.ranking_.Ranking;
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

  updateStageRanking(stage,ranking){
    let data = this.clone();
    data.ranking_.Bibs  = data.racers_.getAll().map((r) => r.id);
    data.ranking_.Stage = stage;
    data.ranking_ = this.ranking_.update(ranking);
    return data;
  }
  
};


