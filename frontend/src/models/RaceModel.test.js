
import { RaceModel, createRaceModelFromJSON }    from './RaceModel';

import json_tdf2026 from '../../testdata/tour_de_france_2026.json' with { type: 'json' };

describe('RaceModel', () => {

  it('Constructor - default', () => {

    const sut = new RaceModel();
    expect(sut.Classifications).toBeDefined();
    expect(sut.Racers).toBeDefined();

  });

  it('From JSON - Tour de France 2026 - mocked', () => {

    const mockClassifications = {update: jest.fn()};
    const mockRacers          = {update: jest.fn()};

    const sut = new RaceModel(mockRacers, mockClassifications );

    sut.update( json_tdf2026 );

    //expect(mockClassifications.update).toHaveBeenCalledWith( json_tdf2026.classifications );
    expect(mockRacers.update).toHaveBeenCalledWith( json_tdf2026.racers );

  });

  it('From JSON - Tour de France 2026', () => {

    const sut = createRaceModelFromJSON( json_tdf2026 );
    expect(sut).toBeDefined();

    const racers = sut.Racers.getAll();
    expect(racers.length).toBe(8);
    expect(racers[0].id).toBe(1);
    expect(racers[0].firstName).toBe("Jean");
    expect(racers[0].lastName).toBe("Dupont");
    expect(racers[1].id).toBe(2);
    expect(racers[1].firstName).toBe("Marie");
    expect(racers[1].lastName).toBe("Bernard");
    
  });

});