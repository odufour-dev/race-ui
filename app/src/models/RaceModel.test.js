
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

});