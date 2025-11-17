import { TimingRecord } from "./TimingRecord";

export class RankingManager {

  #bibs;
  #ranking;
  #stage;

  constructor(ranking = [], bibs = [], stage = 1){
    this.#bibs    = bibs;
    this.#ranking = ranking;
    this.#stage   = stage;
  }

  clone(){
    return new RankingManager(this.#ranking, this.#bibs, this.#stage);
  }

  get Bibs()  {return this.#bibs;}
  get Stage() {return this.#stage;}

  set Bibs(bibs)  {this.#bibs   = bibs.map((b) => Number(b));}
  set Stage(stage){this.#stage  = stage;}
  
  get Ranking(){
    
    // Create a variable with timingRecords to avoid modifications in object property    
    let ranking = this.#ranking;

    // Extract all the ranking which match the stageId
    if (ranking.length > 0){      
      ranking = ranking.filter((t) => t.stage == this.#stage);      
      ranking.sort((a,b) => a.position - b.position);
    }
    
    return this.#fillMissingBibs(ranking);

  }

  update(ranking){

    // Append bibs that appear in ranking to the list (if missing)
    ranking.map((r) => {
      if (r.bib && !this.#bibs.some((b) => b == r.bib)){this.#bibs.push(Number(r.bib))}
    });
    this.#bibs.sort((a,b) => a-b);

    // Make sure that each ranking element is a TimingRecord
    ranking = ranking.map((r) => {
      const rec = new TimingRecord();
      rec.update(r);
      rec.stage = this.#stage;
      return r;
    })

    const data = this.clone();
    data.#ranking = data.#ranking.filter((r) => r.stage != this.#stage).concat(ranking);
    return data;

  }

  #fillMissingBibs(ranking){

    if (this.#bibs.length > 0){
      // Add missing bibs in the ranking with 'unknown' status
      this.#bibs.map((b) => {
        if (!ranking.some((t) => t.bib == b)){
          const prevTiming = this.#ranking.filter((t) => t.bib == b && t.stage == this.#stage-1);
          const status = this.#stage == 1 || (prevTiming.length > 0 && prevTiming[0].status == "done") ? "unknown" : "abs";
          ranking.push(new TimingRecord(b,this.#stage,999,NaN,status));
        }
      });
    }
    return ranking;
  }

}