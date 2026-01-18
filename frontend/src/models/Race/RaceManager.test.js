
import { RaceManager }    from './RaceManager';
import { Stage }    from './Stage';

describe('RaceManager', () => {

  it('Constructor - default', () => {

    const sut = new RaceManager();

    expect(sut.nStages).toEqual(1);
    expect(sut.stages[0]).toBeInstanceOf(Stage);
    expect(sut.annexRankings).toEqual([]);

  });

  it('Add Stage', () => {

    const sut = new RaceManager();
    const actual = sut.addStage();

    expect(actual.nStages).toEqual(2);
    expect(actual.stages[0]).toBeInstanceOf(Stage);
    expect(actual.stages[1]).toBeInstanceOf(Stage);
    
  });

  it('Add Annex Ranking', () => {

    const annex = {id: "mock", type: "test"};

    const sut = new RaceManager();
    const actual = sut.addAnnexRanking(annex);

    expect(actual.annexRankings).toEqual([annex]);
    
  });

  it('Update no annex', () => {

    const data = {
      name: "Tour de France 2026",
      stages: [
        {
          name: "Etape 1",
          id: 1,
          number: 1,
          date: "2026-07-13",
          startLocation: null,
          endLocation: null,
          distance: 150.1,
          type: null,
          createdAt: "2026-01-18T19:35:54.003Z",
          updatedAt: "2026-01-18T19:35:54.003Z",
          raceId: 1
        },
        {
          name: "Etape 2",
          id: 2,
          number: 2,
          date: "2026-07-14",
          startLocation: null,
          endLocation: null,
          distance: 120,
          type: null,
          createdAt: "2026-01-18T19:35:54.003Z",
          updatedAt: "2026-01-18T19:35:54.003Z",
          raceId: 1
        }
      ]
    };

    const sut = new RaceManager();
    const actual = sut.update(data);

    expect(actual.nStages).toEqual(2);
    expect(actual.stages[0].name).toEqual("Etape 1");
    expect(actual.stages[1].name).toEqual("Etape 2");
    expect(actual.annexRankings).toEqual([]);
    
  });

  it('Update with annexes', () => {

    const annexMock = jest.fn();
    const data = {
      name: "Tour de France 2026",
      stages: [
        {
          name: "Etape 1",
          id: 1,
          number: 1,
          date: "2026-07-13",
          startLocation: null,
          endLocation: null,
          distance: 150.1,
          type: null,
          createdAt: "2026-01-18T19:35:54.003Z",
          updatedAt: "2026-01-18T19:35:54.003Z",
          raceId: 1
        },
        {
          name: "Etape 2",
          id: 2,
          number: 2,
          date: "2026-07-14",
          startLocation: null,
          endLocation: null,
          distance: 120,
          type: null,
          createdAt: "2026-01-18T19:35:54.003Z",
          updatedAt: "2026-01-18T19:35:54.003Z",
          raceId: 1
        }
      ]
    };

    const sut = new RaceManager();
    const actual = sut.update(data,annexMock);

    expect(actual.nStages).toEqual(2);
    expect(actual.stages[0].name).toEqual("Etape 1");
    expect(actual.stages[1].name).toEqual("Etape 2");
    expect(actual.annexRankings).toEqual(annexMock);
    
  });

});