import { TimingRecord } from "./TimingRecord";

export class RankingManager {

  constructor(timings = []){
    this.timings_ = timings;
  }

  getRanking(stageId, bibs){
    
    // Create a variable with timingRecords to avoid modifications in object property    
    let timings = this.timings_;

    // Extract all the timings which match the stageId
    if (timings.length > 0){      
      timings = timings.filter((t) => t.stage == stageId);      
      timings.sort((a,b) => a.position - b.position);
    }

    // Add missing bibs in the timings with 'unknown' status
    bibs.map((b) => {
      if (!timings.some((t) => t.bib == b)){
        const prevTiming = this.timings_.filter((t) => t.bib == b && t.stage == stageId-1);
        const status = stageId == 1 || (prevTiming.length > 0 && prevTiming[0].status == "done") ? "unknown" : "abs";
        timings.push(new TimingRecord(b,stageId,999,NaN,status));
      }
    });
    return timings;

  }

  update(stageId, ranking){

  }

  /*
  getRankings(raceId) {
    return this.timings
      .filter(record => record.raceId === raceId)
      .map(record => {
        const person = this.getPersonById(record.personId);
        return {
          name: person.fullName,
          category: person.category,
          totalTime: record.totalTime
        };
      })
      .sort((a, b) => a.totalTime - b.totalTime);
  }
  */
}