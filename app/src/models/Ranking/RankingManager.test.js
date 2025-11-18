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

  it('General - empty', () => {

    const bibs    = [];
    const stage   = 2;
    const ranking = [];

    const sut = new RankingManager(ranking, bibs, stage);
    
    const actual = sut.General.map((g) => g.toObject());
    expect(actual).toEqual([]);
    
  });

  it('General - 2 stages - all finishers - no equality', () => {

    const bibs    = [1,2,3,5];
    const stage   = 2;
    const ranking = [
        new TimingRecord(1, 1, 2,   122,    "done"),
        new TimingRecord(2, 1, 4,   125,    "done"),
        new TimingRecord(3, 1, 1,   120,    "done"),
        new TimingRecord(5, 1, 3,   122,    "done"),
        new TimingRecord(1, 2, 3,   135,    "done"),
        new TimingRecord(2, 2, 2,   134,    "done"),
        new TimingRecord(3, 2, 1,   133,    "done"),
        new TimingRecord(5, 2, 4,   136,    "done"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    
    const actual = sut.General.map((g) => g.toObject());
    expect(actual).toMatchObject([
        {bib:3, position:2, stage:2,   time:253,    status:'done'},
        {bib:1, position:5, stage:2,   time:257,    status:'done'},
        {bib:5, position:7, stage:2,   time:258,    status:'done'},
        {bib:2, position:6, stage:2,   time:259,    status:'done'},
    ]);
    
  });

  it('General - stage 1 - all finishers - no equality', () => {

    const bibs    = [1,2,3,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2,   122,    "done"),
        new TimingRecord(2, 1, 4,   125,    "done"),
        new TimingRecord(3, 1, 1,   120,    "done"),
        new TimingRecord(5, 1, 3,   122,    "done"),
        new TimingRecord(1, 2, 3,   135,    "done"),
        new TimingRecord(2, 2, 2,   134,    "done"),
        new TimingRecord(3, 2, 1,   133,    "done"),
        new TimingRecord(5, 2, 4,   136,    "done"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    
    const actual = sut.General.map((g) => g.toObject());
    expect(actual).toMatchObject([
        {bib:3, position:1, stage:1,   time:120,    status:'done'},
        {bib:1, position:2, stage:1,   time:122,    status:'done'},
        {bib:5, position:3, stage:1,   time:122,    status:'done'},
        {bib:2, position:4, stage:1,   time:125,    status:'done'},
    ]);
    
  });

  it('General - 2 stages - dnf/dns - no equality', () => {

    const bibs    = [1,2,3,5];
    const stage   = 2;
    const ranking = [
        new TimingRecord(1, 1, 2,   122,    "done"),
        new TimingRecord(2, 1, 4,   NaN,    "dnf"),
        new TimingRecord(3, 1, 1,   120,    "done"),
        new TimingRecord(5, 1, 3,   122,    "done"),
        new TimingRecord(1, 2, 3,   135,    "done"),
        new TimingRecord(3, 2, 1,   133,    "done"),
        new TimingRecord(5, 2, 4,   NaN,    "dns"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    
    const actual = sut.General.map((g) => g.toObject());
    expect(actual).toMatchObject([
        {bib:3, position:2, stage:2,   time:253,    status:'done'},
        {bib:1, position:5, stage:2,   time:257,    status:'done'},
        {bib:5, position:7, stage:2,   time:NaN,    status:'dns'},
        {bib:2, position:4, stage:1,   time:NaN,    status:'dnf'},
    ]);
    
  });

});