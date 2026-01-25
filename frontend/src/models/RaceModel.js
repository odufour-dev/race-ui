import { Classification }       from './References/Classification';
import { RaceManager }          from './Race/RaceManager';
import { RacerManager }         from './Racers/RacerManager'; 
import { RankingManager }       from './Ranking/RankingManager';

export class RaceModel {

  #classifications
  #racers

  constructor(racers = new RacerManager(), classifications = new Classification()) {
    this.#classifications = classifications;
    this.#racers          = racers;
  }

  clone(){
    return new RaceModel(this.#racers.clone(), this.#classifications);
  }

  get Classifications(){
    return this.#classifications;
  }

  get Racers() {
    return this.#racers;
  }
 
  getGeneralRanking(stage = 0){
    return [];
  }

  update(data){

    if ('racers' in data){
      this.#racers = this.#racers.update( data.racers );
    }
    return this;

  }

  updateRacerManager(racerManager) {
    return new RaceModel(racerManager, this.#classifications);
  }
  
}

export function createRaceModelFromJSON(jsondata) {
  const model = new RaceModel();
  model.update(jsondata);
  return model
}

export function createEmptyRaceModel() {
  return new RaceModel();
}
