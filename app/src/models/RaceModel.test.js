
import { RaceModel } from "./RaceModel"

import { Classification } from './References/Classification';
import { RaceManager }    from './Race/RaceManager';
import { RacerManager }   from './Racers/RacerManager'; 
import { TimingRecord }   from './Ranking/TimingRecord'; 

describe('RaceModel', () => {

  it('Constructor - default', () => {

    const sut = new RaceModel();

    expect(sut.Racers).toBeInstanceOf(RacerManager);
    expect(sut.Race).toBeInstanceOf(RaceManager);
    expect(sut.Classifications).toBeInstanceOf(Classification);

  });

  it('updateRacerManager', () => {

    const racers = new RacerManager();

    const sut = new RaceModel();

    const actual = sut.getStageRanking(1);

    expect(actual).toEqual([]);
    
  });

  it('getStageRanking - no data', () => {

    const sut = new RaceModel();

    const actual = sut.getStageRanking(1);

    expect(actual).toEqual([]);
    
  });

  it('getStageRanking - all', () => {

    let sut = new RaceModel();

    sut.Racers.add({id: 1, firstName: "Paul",   lastName: "POULE"});
    sut.Racers.add({id: 2, firstName: "Pierre", lastName: "PONCE"});
    sut.Racers.add({id: 3, firstName: "Jacques",lastName: "BEAUREGARD"});
    sut.Racers.add({id: 4, firstName: "Jean",   lastName: "CROISSANT"});
    sut.Racers.add({id: 5, firstName: "René",   lastName: "TAUPE"});

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1, time: 5010, status: "done"},
      {bib: 5, position: 2, time: 5010, status: "done"},
      {bib: 3, position: 3, time: 5010, status: "done"},
      {bib: 1, position: 4, time: 5010, status: "done"},
      {bib: 4, position: 5, time: 5010, status: "done"},
    ]);

    const actual = sut.getStageRanking(1);
    expect(actual).toMatchObject([
      {bib: 2, stage: 1, position: 1, time: 5010, status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 5, stage: 1, position: 2, time: 5010, status: "done", firstname: "René",    lastname: "TAUPE"     },
      {bib: 3, stage: 1, position: 3, time: 5010, status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 1, stage: 1, position: 4, time: 5010, status: "done", firstname: "Paul",    lastname: "POULE"     },
      {bib: 4, stage: 1, position: 5, time: 5010, status: "done", firstname: "Jean",    lastname: "CROISSANT" },
    ]);
    
  });

  it('getStageRanking - with dnf/dns', () => {

    let sut = new RaceModel();

    sut.Racers.add({id: 1, firstName: "Paul",   lastName: "POULE"});
    sut.Racers.add({id: 2, firstName: "Pierre", lastName: "PONCE"});
    sut.Racers.add({id: 3, firstName: "Jacques",lastName: "BEAUREGARD"});
    sut.Racers.add({id: 4, firstName: "Jean",   lastName: "CROISSANT"});
    sut.Racers.add({id: 5, firstName: "René",   lastName: "TAUPE"});

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1, time: "01:23:32", status: "done"},
      {bib: 5, position: 2, time: "01:23:35", status: "done"},
      {bib: 3, position: 3, time: "01:23:35", status: "done"},
      {bib: 1, position: 4, time: "",         status: "dnf"},
      {bib: 4, position: 5, time: "",         status: "dns"},
    ]);

    const actual = sut.getStageRanking(1);
    expect(actual).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5012,   status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 5, stage: 1, position: 2,   time: 5015,   status: "done", firstname: "René",    lastname: "TAUPE"     },
      {bib: 3, stage: 1, position: 3,   time: 5015,   status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 1, stage: 1, position: 4,   time: null,    status: "dnf" , firstname: "Paul",    lastname: "POULE"     },
      {bib: 4, stage: 1, position: 5,   time: null,    status: "dns" , firstname: "Jean",    lastname: "CROISSANT" },
    ]);
    
  });

  it('getGeneralRanking - all', () => {

    let sut = new RaceModel();

    sut.Racers.add({id: 1, firstName: "Paul",   lastName: "POULE"});
    sut.Racers.add({id: 2, firstName: "Pierre", lastName: "PONCE"});
    sut.Racers.add({id: 3, firstName: "Jacques",lastName: "BEAUREGARD"});
    sut.Racers.add({id: 4, firstName: "Jean",   lastName: "CROISSANT"});
    sut.Racers.add({id: 5, firstName: "René",   lastName: "TAUPE"});

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1, time: 5010, status: "done"},
      {bib: 5, position: 2, time: 5010, status: "done"},
      {bib: 3, position: 3, time: 5010, status: "done"},
      {bib: 1, position: 4, time: 5010, status: "done"},
      {bib: 4, position: 5, time: 5010, status: "done"},
    ]);
    sut = sut.updateStageRanking(2, [
      {bib: 1, position: 1, time: 1234, status: "done"},
      {bib: 3, position: 2, time: 1236, status: "done"},
      {bib: 2, position: 3, time: 1238, status: "done"},
      {bib: 4, position: 4, time: 1240, status: "done"},
      {bib: 5, position: 5, time: 1500, status: "done"},
    ]);

    // General ranking after 1st stage (== stage ranking)
    expect(sut.getGeneralRanking(1)).toMatchObject([
      {bib: 2, stage: 1, position: 1, time: 5010, status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 5, stage: 1, position: 2, time: 5010, status: "done", firstname: "René",    lastname: "TAUPE"     },
      {bib: 3, stage: 1, position: 3, time: 5010, status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 1, stage: 1, position: 4, time: 5010, status: "done", firstname: "Paul",    lastname: "POULE"     },
      {bib: 4, stage: 1, position: 5, time: 5010, status: "done", firstname: "Jean",    lastname: "CROISSANT" },
    ]);

    // General ranking after 2nd stage
    expect(sut.getGeneralRanking(2)).toMatchObject([
      {bib: 1, stage: 2, position: 5, time: 6244, status: "done", firstname: "Paul",    lastname: "POULE"     },
      {bib: 3, stage: 2, position: 5, time: 6246, status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 2, stage: 2, position: 4, time: 6248, status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 4, stage: 2, position: 9, time: 6250, status: "done", firstname: "Jean",    lastname: "CROISSANT" },
      {bib: 5, stage: 2, position: 7, time: 6510, status: "done", firstname: "René",    lastname: "TAUPE"     },
    ]);
    
  });

  it('getGeneralRanking - with dnf/dns', () => {

    let sut = new RaceModel();

    sut.Racers.add({id: 1, firstName: "Paul",   lastName: "POULE"});
    sut.Racers.add({id: 2, firstName: "Pierre", lastName: "PONCE"});
    sut.Racers.add({id: 3, firstName: "Jacques",lastName: "BEAUREGARD"});
    sut.Racers.add({id: 4, firstName: "Jean",   lastName: "CROISSANT"});
    sut.Racers.add({id: 5, firstName: "René",   lastName: "TAUPE"});

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1,   time: 5010, status: "done"},
      {bib: 5, position: 2,   time: 5010, status: "done"},
      {bib: 3, position: 3,   time: 5010, status: "done"},
      {bib: 1, position: 4,   time: 5010, status: "done"},
      {bib: 4, position: null, time: null,  status: "dnf"},
    ]);
    sut = sut.updateStageRanking(2, [
      {bib: 1, position: 1,   time: 1234, status: "done"},
      {bib: 3, position: 2,   time: 1236, status: "done"},
      {bib: 2, position: 3,   time: 1238, status: "done"},
      {bib: 5, position: null, time: null,  status: "dns" },
    ]);

    // General ranking after 1st stage (== stage ranking)
    expect(sut.getGeneralRanking(1)).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5010, status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 5, stage: 1, position: 2,   time: 5010, status: "done", firstname: "René",    lastname: "TAUPE"     },
      {bib: 3, stage: 1, position: 3,   time: 5010, status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 1, stage: 1, position: 4,   time: 5010, status: "done", firstname: "Paul",    lastname: "POULE"     },
      {bib: 4, stage: 1, position: null,time: null,  status: "dnf",  firstname: "Jean",    lastname: "CROISSANT" },
    ]);

    // General ranking after 2nd stage
    expect(sut.getGeneralRanking(2)).toMatchObject([
      {bib: 1, stage: 2, position: 5,   time: 6244, status: "done", firstname: "Paul",    lastname: "POULE"     },
      {bib: 3, stage: 2, position: 5,   time: 6246, status: "done", firstname: "Jacques", lastname: "BEAUREGARD"},
      {bib: 2, stage: 2, position: 4,   time: 6248, status: "done", firstname: "Pierre",  lastname: "PONCE"     },
      {bib: 5, stage: 2, position: 2,   time: 5010, status: "dns",  firstname: "René",    lastname: "TAUPE"     },
      {bib: 4, stage: 1, position: null,time: null,  status: "dnf",  firstname: "Jean",    lastname: "CROISSANT" },
    ]);
    
  });

  it('getGeneralRanking - no registered racers', () => {

    let sut = new RaceModel();

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1,   time: 5010, status: "done"},
    ]);

    // General ranking after 1st stage (== stage ranking)
    expect(sut.getGeneralRanking(1)).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5010, status: "done"},
    ]);
    
  });

  it('getStageRanking & getGeneralRanking - no registered racers', () => {

    let sut = new RaceModel();

    sut = sut.updateStageRanking(1, [
      {bib: 2, position: 1,   time: 5010, status: "done"},
    ]);

    // Stage ranking after 1st stage (== stage ranking)
    expect(sut.getStageRanking(1)).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5010, status: "done"},
    ]);

    // General ranking after 1st stage (== stage ranking)
    expect(sut.getGeneralRanking(1)).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5010, status: "done"},
    ]);
    
  });
  
});