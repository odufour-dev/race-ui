import { TimingRecord } from "./TimingRecord";

export class RankingManager {

  #ranking;
  #stage;

  constructor(ranking = [], stage = 1){
    this.#ranking = ranking;
    this.#stage   = stage;
  }

  clone(){
    return new RankingManager(this.#ranking, this.#stage);
  }

  get Stage() {return this.#stage;}
  set Stage(stage){this.#stage  = stage;}

  get General(){

    let ranking = this.#ranking;
    if (ranking.length > 0){

      const initval = [];
      ranking.sort((a,b) => a.stage - b.stage); // Sort by ascending stages - latest status is the most important
      ranking = ranking
                  .filter((r) => r.stage <= this.#stage)
                  .reduce((gen,r) => {
                    const id = "x" + String(r.bib);
                    const millisecs = r.millisecs != null ? r.millisecs : 0;
                    if (id in gen){
                      gen[id].cumposition  += r.position;
                      gen[id].time         += r.time ?? 0;
                      gen[id].stage        = r.stage;
                      gen[id].status       = r.status;
                      gen[id].lastposition = r.position;
                      gen[id].millisecs    += millisecs;                      
                    } else {
                      gen[id] = {bib: r.bib, cumposition: r.position, time: r.time, stage: r.stage, status: r.status, lastposition: r.position, millisecs: millisecs};
                    }                    
                    return gen;
                  },initval);
      ranking = Object.keys(ranking).map((k) => {
        return {
          bib:          ranking[k].bib, 
          stage:        ranking[k].stage, 
          cumposition:  ranking[k].cumposition,
          lastposition: ranking[k].lastposition, 
          time:         ranking[k].time, 
          status:       ranking[k].status
        }
      });
      ranking.sort((a,b) => this.#sort(a,b));
      ranking = ranking.map((r,idx) => {
        if (r.status === 'done'){
          return {...r, position: idx + 1};
        } else {
          return {...r, position: 0};
        }
      });

    }
    return ranking;

  }
  
  get Ranking(){
    
    // Create a variable with timingRecords to avoid modifications in object property    
    let ranking = this.#ranking;

    // Extract all the ranking which match the stageId
    if (ranking.length > 0){      
      ranking = ranking.filter((t) => t.stage == this.#stage);      
      ranking.sort((a,b) => this.#sort(a,b));
    }
    
    return ranking;

  }

  fromJSON(data){
    const ranking = data.flatMap((stageres) => {
      return stageres.results.map((r) => {
        const rec = new TimingRecord();
        rec.update(r);
        return rec;
      })
    });
    return new RankingManager(ranking, this.#stage);
  }

  update(ranking){

    // Make sure that each ranking element is a TimingRecord
    ranking = ranking.map((r) => {
      const rec = new TimingRecord();
      rec.update(r);
      return rec;
    })
    ranking = this.#ranking.filter((r) => r.stage != this.#stage).concat(ranking);
    return new RankingManager(ranking, this.#stage);

  }

  #sort(a,b){
    // If final status is not done, consider that racer does not finish => go to the end
    // Sort non-finisher based on the last recorded stage (higher first)
    if (a.status == "done" && b.status != "done"){return -1;}
    else if (a.status != "done" && b.status == "done"){return 1;}
    else if (a.stage != b.stage){return b.stage - a.stage;}
    // Finishers (status == done)
    //  1. Compare the time (if different)
    //  2. Compare the milliseconds (if different)
    //  3. Compare the cumulated positions
    //  4. Compare the last position
    else if (a.time != b.time){return a.time - b.time;}
    else if (a.millisecs != b.millisecs){return a.millisecs - b.millisecs;}
    else if (a.cumposition != b.cumposition){return a.cumposition - b.cumposition;}
    else {return a.lastposition - b.lastposition;}
  }

}