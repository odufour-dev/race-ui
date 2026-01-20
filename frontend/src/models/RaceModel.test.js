
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

    const mockAnnex           = {fromJSON: jest.fn().mockReturnValue([])};
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

    const racers = sut.Racers.getAll();
    expect(racers.length).toBe(8);
    expect(racers[0].id).toBe(1);
    expect(racers[0].firstName).toBe("Jean");
    expect(racers[0].lastName).toBe("Dupont");
    expect(racers[1].id).toBe(2);
    expect(racers[1].firstName).toBe("Marie");
    expect(racers[1].lastName).toBe("Bernard");
    
    expect(sut.Race.nStages).toBe(2);
    expect(sut.Race.stages[0].distance).toBe(150.1);
    expect(sut.Race.stages[0].date).toBe("2026-07-13");
    expect(sut.Race.stages[1].distance).toBe(120);
    expect(sut.Race.stages[1].date).toBe("2026-07-14");

    expect(sut.Race.annexRankings.length).toBe(4);
    expect(sut.Race.annexRankings[0].type).toBe("points");
    expect(sut.Race.annexRankings[0].title).toBe("points");
    expect(sut.Race.annexRankings[0].categories.length).toBe(1);
    expect(sut.Race.annexRankings[0].points.length).toBe(1);
    expect(sut.Race.annexRankings[0].categories[0]).toBe("sprint");
    expect(sut.Race.annexRankings[0].points[0].length).toBe(3);
    expect(sut.Race.annexRankings[0].points[0][0]).toBe(5);
    expect(sut.Race.annexRankings[0].points[0][1]).toBe(3);
    expect(sut.Race.annexRankings[0].points[0][2]).toBe(1);

    expect(sut.Race.annexRankings[1].type).toBe("points");
    expect(sut.Race.annexRankings[1].title).toBe("GPM");
    expect(sut.Race.annexRankings[1].categories.length).toBe(2);
    expect(sut.Race.annexRankings[1].points.length).toBe(2);
    expect(sut.Race.annexRankings[1].categories[0]).toBe("cat1");
    expect(sut.Race.annexRankings[1].points[0].length).toBe(3);
    expect(sut.Race.annexRankings[1].points[0][0]).toBe(5);
    expect(sut.Race.annexRankings[1].points[0][1]).toBe(3);
    expect(sut.Race.annexRankings[1].points[0][2]).toBe(1);
    expect(sut.Race.annexRankings[1].categories[1]).toBe("cat2");
    expect(sut.Race.annexRankings[1].points[1].length).toBe(2);
    expect(sut.Race.annexRankings[1].points[1][0]).toBe(3);
    expect(sut.Race.annexRankings[1].points[1][1]).toBe(1);

    expect(sut.Race.annexRankings[2].type).toBe("filter");
    expect(sut.Race.annexRankings[2].title).toBe("Jeunes");
    expect(sut.Race.annexRankings[3].type).toBe("team");
    expect(sut.Race.annexRankings[3].title).toBe("Equipe");

  });

});