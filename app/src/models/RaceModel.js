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
    return new RaceModel(this.#racers.clone(), this.#annex.clone(), this.#classifications, this.#race.clone(), this.#ranking.clone());
  }

  get Classifications(){
    return this.#classifications;
  }

  get Annex(){
    return this.#annex;
  }

  get Race(){
    return this.#race;
  }

  get Racers() {
    return this.#racers;
  }

  addAnnexRanking(type,id){
    let data = this.clone();
    const ranking = data.#annex.build(type,id);
    data.#race.addAnnexRanking(ranking);
    return data.clone();
  }
    
  getStageRanking(stage){

    // Configure the ranking manager to get stage ranking
    this.#ranking.Bibs  = this.#racers.getAll().map((r) => r.id);
    this.#ranking.Stage = stage;
    let ranking = this.#ranking.Ranking;

    const racers = this.#racers.getAll();
    return ranking.map((rank) => {
      const current = racers.filter((racer) => racer.id == rank.bib);
      if (current.length == 1){
        return {...rank.toObject(),...current[0].toObject()};          
      } else {
        return {...rank.toObject(),...this.#racers.getDefault().toObject()};
      }      
    });

  }

  getGeneralRanking(stage = 0){

    // Configure the ranking manager to get stage ranking
    this.#ranking.Bibs  = this.#racers.getAll().map((r) => r.id);
    this.#ranking.Stage = stage > 0 ? stage : this.#race.nStages;
    let ranking = this.#ranking.General;

    const racers = this.#racers.getAll();
    return ranking.map((rank) => {
      const current = racers.filter((racer) => racer.id == rank.bib);
      if (current.length == 1){
        return {...rank.toObject(),...current[0].toObject()};          
      } else {
        return {...rank.toObject(),...this.#racers.getDefault().toObject()};
      }      
    });

  }

  updateRace(race){
    return new RaceModel(this.#racers.clone(), this.#annex.clone(), this.#classifications, race, this.#ranking.clone());
  }

  updateRacerManager(racerManager) {
    return new RaceModel(racerManager, this.#annex.clone(), this.#classifications, this.#race.clone(), this.#ranking.clone());
  }

  updateStageRanking(stage,ranking){

    let data = this.clone();
    data.#ranking.Bibs  = data.#racers.getAll().map((r) => r.id);
    data.#ranking.Stage = stage;
    data.#ranking = data.#ranking.update(ranking);
    return data;
  }
  
};


