
import { RaceModel } from "./RaceModel"

import { Classification } from './References/Classification';
import { RaceManager }    from './Race/RaceManager';
import { RacerManager }   from './Racers/RacerManager'; 

describe('RaceModel', () => {

  it('Constructor - default', () => {

    const sut = new RaceModel();

    expect(sut.getRacerManager()).toBeInstanceOf(RacerManager);
    expect(sut.getRace()).toBeInstanceOf(RaceManager);
    expect(sut.getClassifications()).toBeInstanceOf(Classification);

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

});