
import { RaceManager }    from './RaceManager';

import { Stage }    from './Stage';

describe('RaceManager', () => {

  it('Constructor - default', () => {

    const sut = new RaceManager();

    expect(sut.nStages).toEqual(1);
    expect(sut.stages[0]).toBeInstanceOf(Stage);
    expect(sut.annexRankings).toEqual([]);

  });

});