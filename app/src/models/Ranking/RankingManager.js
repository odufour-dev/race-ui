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
                    if (id in gen){
                      gen[id].position     += r.position;
                      gen[id].time         += r.time;
                      gen[id].stage        = r.stage;
                      gen[id].status       = r.status;
                      gen[id].lastposition = r.position;
                    } else {
                      gen[id] = {bib: r.bib, position: r.position, time: r.time, stage: r.stage, status: r.status, lastposition: r.position};
                    }                    
                    return gen;
                  },initval);
      ranking = Object.keys(ranking).map((k) => {
        return {
          bib:          ranking[k].bib, 
          stage:        ranking[k].stage, 
          position:     ranking[k].position,
          lastposition: ranking[k].lastposition, 
          time:         ranking[k].time, 
          status:       ranking[k].status
        }
      });
      ranking.sort((a,b) => this.#sort(a,b));
      ranking = ranking.map((r) => new TimingRecord(r.bib,r.stage,r.position,r.time,r.status));

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

  update(ranking){

    // Make sure that each ranking element is a TimingRecord
    ranking = ranking.map((r) => {
      const rec = new TimingRecord();
      rec.update(r);
      return rec;
    })
    return new RankingManager(this.#ranking.filter((r) => r.stage != this.#stage).concat(ranking), this.#stage);

  }
/*
  #fillMissingBibs(ranking){

    if (this.#bibs.length > 0){
      // Add missing bibs in the ranking with 'unknown' status
      this.#bibs.map((b) => {
        if (!ranking.some((t) => t.bib == b)){
          const prevTiming = this.#ranking.filter((t) => t.bib == b && t.stage == this.#stage-1);
          const status = this.#stage == 1 || (prevTiming.length > 0 && prevTiming[0].status == "done") ? "unknown" : "abs";
          ranking.push(new TimingRecord(b,this.#stage,null,NaN,status));
        }
      });
    }
    return ranking;
  }
*/
  #sort(a,b){
    // If final status is not done, consider that racer does not finish => go to the end
    // Sort non-finisher based on the last recorded stage (higher first)
    if (a.status == "done" && b.status != "done"){return -1;}
    else if (a.status != "done" && b.status == "done"){return 1;}
    else if (a.stage != b.stage){return b.stage - a.stage;}
    // Finishers (status == done)
    //  1. Compare the time (if different)
    //  2. Compare the cumulated positions
    //  3. Compare the last position
    else if (a.time != b.time){return a.time - b.time;}
    else if (a.position != b.position){return a.position - b.position;}
    else {return a.lastposition - b.lastposition;}
  }

}