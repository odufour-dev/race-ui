import { Racer } from "./Racer"

export class RacerManager {

  constructor(racers = []) {
    this.racers = racers;
  }

  clone(){
    return new RacerManager(this.racers);
  }

  add(r) {

    const racer = new Racer();    
    Object.keys(r).map((k) => {
      if (k in racer){
        racer[k] = r[k];
      } else {
        console.log("Unknown racer field: ", k);
      }
    });    

    let data = this.clone();
    data.racers.push(racer);
    return data;
  }

  clear(){
    this.racers = [];
  }

  getAll() {
    return this.racers;
  }

  getFields() {
    return ['id', 'firstName', 'lastName', 'sex', 'age', 'category', 'subcategory', 'club', 'uciID', 'ffcID'];
  }

  edit(index, field, newValue) {
    if (index < 0 || index >= this.racers.length) return;
    if (!(field in this.racers[index])) return;
    let data = this.clone();
    data.racers[index][field] = newValue;
    return data;
  }

  remove(index){
    let data = this.clone();
    data.racers = data.racers.filter((_,idx) => idx !== index);
    return data;
  }

  generateIds() {
    let data = this.clone();
    data.racers = data.racers.map((racer, index) => {
      racer.id = index + 1;
      return racer;
    });
    return data;
  }

  shuffleRacers() {
    let data = this.clone();
    for (let i = data.racers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [data.racers[i], data.racers[j]] = [data.racers[j], data.racers[i]];
    }
    return data;
  }

  updateRanking(stage, ranking){
    // ranking:
    //  - bib = Racer identifier
    //  - position
    //  - time
    //  - status : unknown, dnf, dns, abs, done
    const data = this.clone();
    data.racers = this.racers.map((racer) => {
      const racerrank = ranking.filter((rank) => racer.id === rank.bib);
      if (racerrank.length > 0){
        racer.StageRank[stage-1] = {
            position: racerrank[0].position,
            time: racerrank[0].time,
            status: racerrank[0].status
          };
      }
      return racer;
    });
    
    return data;
  }
  
  get length() {
    return this.racers.length;
  }

}