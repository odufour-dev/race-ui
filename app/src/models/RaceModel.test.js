
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
    expect(actual.map((g) => g.toObject())).toMatchObject([
      {bib: 2, stage: 1, position: 1, time: 5010, status: "done"},
      {bib: 5, stage: 1, position: 2, time: 5010, status: "done"},
      {bib: 3, stage: 1, position: 3, time: 5010, status: "done"},
      {bib: 1, stage: 1, position: 4, time: 5010, status: "done"},
      {bib: 4, stage: 1, position: 5, time: 5010, status: "done"},
    ]);
    
  });

  it('getStageRanking - dnf/dns', () => {

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
    expect(actual.map((g) => g.toObject())).toMatchObject([
      {bib: 2, stage: 1, position: 1,   time: 5012,   status: "done"},
      {bib: 5, stage: 1, position: 2,   time: 5015,   status: "done"},
      {bib: 3, stage: 1, position: 3,   time: 5015,   status: "done"},
      {bib: 1, stage: 1, position: 999, time: NaN,    status: "dnf" },
      {bib: 4, stage: 1, position: 999, time: NaN,    status: "dns" },
    ]);
    
  });

});