import { Classification }       from './References/Classification';
import { RaceManager }          from './Race/RaceManager';
import { RacerManager }         from './Racers/RacerManager'; 
import { RankingManager }       from './Ranking/RankingManager';
import { AnnexRankingManager }  from './AnnexRanking/AnnexRankingManager';

export class RaceModel {

  #annex
  #classifications
  #race
  #racers
  #ranking

  constructor(racers = new RacerManager(), annex = new AnnexRankingManager(), classifications = new Classification(), race = new RaceManager(), ranking = new RankingManager()) {
    this.#annex           = annex;
    this.#classifications = classifications;
    this.#race            = race;
    this.#racers          = racers;
    this.#ranking         = ranking;
  }

  clone(){
    return new RaceModel(this.#racers.clone(), this.#annex.clone(), this.classifications, this.#race.clone(), this.#ranking.clone());
  }

  getClassifications(){
    return this.#classifications;
  }

  getRace(){
    return this.#race;
  }

  getRacerManager() {
    return this.#racers;
  }

  get annexRankingTypes(){
    return this.#annex.list;
  }

  addAnnexRanking(type,id){
    const ranking = this.#annex.build(type,id);
    this.#race    = addAnnexRanking(ranking);
    return this.clone();
  }
    
  getStageRanking(stage){
    this.#ranking.Bibs  = this.#racers.getAll().map((r) => r.id);
    this.#ranking.Stage = stage;
    return this.#ranking.Ranking;
  }

  updateRace(race){
    let data = this.clone();
    data.#race = race;
    return data;
  }

  updateRacerManager(racerManager) {
    let data = this.clone();
    data.#racers = racerManager;
    return data;
  }

  updateStageRanking(stage,ranking){
    let data = this.clone();
    data.#ranking.Bibs  = data.#racers.getAll().map((r) => r.id);
    data.#ranking.Stage = stage;
    data.#ranking = this.#ranking.update(ranking);
    return data;
  }
  
};


