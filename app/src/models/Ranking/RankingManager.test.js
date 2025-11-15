import { RankingManager }   from "./RankingManager";
import { TimingRecord }     from "./TimingRecord";

describe('RankingManager', () => {

  it('Constructor - default', () => {

    const sut = new RankingManager();

    expect(sut.Bibs).toEqual([]);
    expect(sut.Ranking).toEqual([]);
    expect(sut.Stage).toEqual(1);

  });

  it('[SET/GET] Bibs', () => {

    const bibs = [1,2,3,4,5];

    const sut = new RankingManager();

    sut.Bibs = bibs;
    expect(sut.Bibs).toEqual(bibs);

  });

  it('[SET/GET] Stage', () => {

    const stage = 4;

    const sut = new RankingManager();

    sut.Stage = stage;
    expect(sut.Stage).toEqual(stage);

  });

  it('[GET] Ranking - no timing - no stage', () => {

    const bibs    = [1,2,3,4,5];
    const ranking = [];
    const sut = new RankingManager(ranking,bibs);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(1, 1, 999, NaN, "unknown"),
        new TimingRecord(2, 1, 999, NaN, "unknown"),
        new TimingRecord(3, 1, 999, NaN, "unknown"),
        new TimingRecord(4, 1, 999, NaN, "unknown"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ])

  });

  it('[GET] Ranking - perfect match', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('[GET] Ranking - multiple stages', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('[GET] Ranking - less bibs', () => {

    const bibs    = [1,2,3];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('[GET] Ranking - more bibs', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(4, 1, 999, NaN, "unknown"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ])

  });

  it('[GET] Ranking - Stage 2 - DNS/DNF/ABS', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 2;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking;

    expect(actual).toEqual([
        new TimingRecord(5, 2, 1, 50,   "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 2, 999, NaN, "abs"),
        new TimingRecord(3, 2, 999, NaN, "unknown"),
        new TimingRecord(4, 2, 999, NaN, "abs"),
    ])

  });

  it('Update - Add to an empty object', () => {

    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];

    const sut = new RankingManager();
    const actual = sut.update(ranking);
    
    expect(actual.Ranking).toEqual([
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ]);
    expect(actual.Bibs).toEqual([1,2,3,5]);
    
  });

  it('Update - Existing table, change values', () => {

    const bibs    = [1,2,3,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    const actual = sut.update([
        new TimingRecord(1, 1, 2, 150, "done"),
        new TimingRecord(1, 2, 999, 300, "dns"),
        new TimingRecord(2, 1, 4, 175, "done"),
        new TimingRecord(5, 2, 999, NaN, "dns"),
        new TimingRecord(3, 1, 1, 122, "done"),
    ]);
    
    expect(actual.Ranking).toEqual([
        new TimingRecord(3, 1, 1, 122, "done"),
        new TimingRecord(1, 1, 2, 150, "done"),
        new TimingRecord(2, 1, 4, 175, "done"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ]);
    expect(actual.Bibs).toEqual([1,2,3,5]);
    
  });

});