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
    this.#ranking.Stage = stage > 0 ? stage : this.#race.nStages;
    let ranking = this.#ranking.Ranking.map((r) => r.toObject());

    // Append racers that are not in the ranking
    ranking = this.#fillMissingBibs(stage,ranking);

    return ranking.map((rank) => {
      const current = this.#racers.getAll().filter((racer) => racer.id == rank.bib);
      if (current.length == 1){
        return {...rank,...current[0].toObject()};          
      } else {
        return {...rank,...this.#racers.getDefault().toObject()};
      }      
    });

  }

  getGeneralRanking(stage = 0){

    // Configure the ranking manager to get stage ranking
    this.#ranking.Stage = stage > 0 ? stage : this.#race.nStages;
    let ranking = this.#ranking.General.map((g) => g.toObject());;

    // Append racers that are not in the ranking
    ranking = this.#fillMissingBibs(stage,ranking);

    // Assemble racers and ranking information
    return ranking.map((rank) => {
      const current = this.#racers.getAll().filter((racer) => racer.id == rank.bib);
      if (current.length == 1){
        return {...rank,...current[0].toObject()};          
      } else {
        return {...rank,...this.#racers.getDefault().toObject()};
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

    ranking = ranking.map((r) => "stage" in r ? r : {...r, stage: stage});
    
    let data = this.clone();
    data.#ranking.Stage = stage;
    data.#ranking = data.#ranking.update(ranking);
    return data;

  }
  
  #fillMissingBibs(stage,ranking){

    const bibs  = this.#racers.getAll().map((r) => r.id);
    if (bibs.length > 0){
      // Add missing bibs in the ranking with 'unknown' status
      bibs.map((b) => {
        if (!ranking.some((t) => t.bib == b)){
          ranking.push({bib: b, stage: stage, position: null, time: null,status: "unknown"});
        }
      });
    }
    return ranking;
  }

};


