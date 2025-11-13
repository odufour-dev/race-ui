
export class RankingManager {

  constructor(racers = [], stages) {
    this.racers_ = racers;
    this.stages_ = stages;
  }

  getRanking(stageId){

  }

  updateRanking(stageId, ranking){

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