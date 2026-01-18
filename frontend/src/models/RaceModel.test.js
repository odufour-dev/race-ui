
import { RaceModel, createRaceModelFromJSON }    from './RaceModel';

import json_tdf2026 from '../../testdata/tour_de_france_2026.json' with { type: 'json' };

describe('RaceModel', () => {

  it('Constructor - default', () => {

    const sut = new RaceModel();
    expect(sut.Annex).toBeDefined();
    expect(sut.Classifications).toBeDefined();
    expect(sut.Race).toBeDefined();
    expect(sut.Racers).toBeDefined();

  });

  it('From JSON - Tour de France 2026 - mocked', () => {

    const mockAnnex           = {fromJSON: jest.fn()};
    const mockClassifications = {update: jest.fn()};
    const mockRace            = {update: jest.fn()};
    const mockRacers          = {update: jest.fn()};
    const mockRanking         = {update: jest.fn()};

    const sut = new RaceModel(mockRacers, mockAnnex, mockClassifications, mockRace, mockRanking );

    sut.update( json_tdf2026 );

    expect(mockAnnex.fromJSON).toHaveBeenCalledWith( json_tdf2026.configuration.annex );
    //expect(mockClassifications.update).toHaveBeenCalledWith( json_tdf2026.classifications );
    expect(mockRace.update).toHaveBeenCalledWith( json_tdf2026.configuration );
    expect(mockRacers.update).toHaveBeenCalledWith( json_tdf2026.racers );
    //expect(mockRanking.update).toHaveBeenCalledWith( json_tdf2026.stageResults );

  });

  it('From JSON - Tour de France 2026', () => {

    const sut = createRaceModelFromJSON( json_tdf2026 );
    expect(sut).toBeDefined();
    expect(sut.Racers.getAll().length).toBe(8);

  });

});