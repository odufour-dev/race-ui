
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

});