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

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 1, stage: 1, position: null, time: null, status: "unknown"},
        {bib: 2, stage: 1, position: null, time: null, status: "unknown"},
        {bib: 3, stage: 1, position: null, time: null, status: "unknown"},
        {bib: 4, stage: 1, position: null, time: null, status: "unknown"},
        {bib: 5, stage: 1, position: null, time: null, status: "unknown"},
    ])

  });

  it('[GET] Ranking - perfect match', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 4, stage: 1, position: 1,     time: 120,  status: "done" },
        {bib: 1, stage: 1, position: 2,     time: 122,  status: "done" },
        {bib: 3, stage: 1, position: 3,     time: 122,  status: "done" },
        {bib: 5, stage: 1, position: 4,     time: 130,  status: "done" },
        {bib: 2, stage: 1, position: null,  time: null, status: "dnf"  },
    ])

  });

  it('[GET] Ranking - multiple stages', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 4, stage: 1, position: 1,   time: 120, status: "done" },
        {bib: 1, stage: 1, position: 2,   time: 122, status: "done" },
        {bib: 3, stage: 1, position: 3,   time: 122, status: "done" },
        {bib: 5, stage: 1, position: 4,   time: 130, status: "done" },
        {bib: 2, stage: 1, position: null, time: null, status: "dnf"  },
    ])

  });

  it('[GET] Ranking - less bibs', () => {

    const bibs    = [1,2,3];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 4, stage: 1, position: 1,   time: 120, status: "done" },
        {bib: 1, stage: 1, position: 2,   time: 122, status: "done" },
        {bib: 3, stage: 1, position: 3,   time: 122, status: "done" },
        {bib: 5, stage: 1, position: 4,   time: 130, status: "done" },
        {bib: 2, stage: 1, position: null, time: null, status: "dnf"  },
    ])

  });

  it('[GET] Ranking - more bibs', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 1, stage: 1, position: 2,   time: 122, status: "done"   },
        {bib: 3, stage: 1, position: 3,   time: 122, status: "done"   },
        {bib: 2, stage: 1, position: null, time: null, status: "dnf"    },
        {bib: 4, stage: 1, position: null, time: null, status: "unknown"},
        {bib: 5, stage: 1, position: null, time: null, status: "unknown"},
    ])

  });

  it('[GET] Ranking - Stage 2 - DNS/DNF/ABS', () => {

    const bibs    = [1,2,3,4,5];
    const stage   = 2;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(ranking, bibs, stage);

    const actual = sut.Ranking.map((r) => r.toObject());
    expect(actual).toMatchObject([
        {bib: 5, stage: 2, position: 1,   time: 50,  status: "done"},
        {bib: 1, stage: 2, position: null, time: 122, status: "dns"},
        {bib: 2, stage: 2, position: null, time: null, status: "abs"},
        {bib: 3, stage: 2, position: null, time: null, status: "unknown"},
        {bib: 4, stage: 2, position: null, time: null, status: "abs"},
    ])

  });

  it('Update - Add to an empty object', () => {

    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];

    const sut = new RankingManager();
    sut.Stage = 1;

    const actual = sut.update(ranking);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 2,   time: 122, status: "done"},
        {bib: 3, stage: 1, position: 3,   time: 122, status: "done"},
        {bib: 2, stage: 1, position: null, time: null, status: "dnf"},
        {bib: 5, stage: 1, position: null, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1,2,3,5]);
    
  });

  it('Update - Existing table, change values', () => {

    const bibs    = [1,2,3,5];
    const stage   = 1;
    const ranking = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, null, 122, "dns"),
        new TimingRecord(2, 1, null, null, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    const actual = sut.update([
        new TimingRecord(1, 1, 2, 150, "done"),
        new TimingRecord(1, 2, null, 300, "dns"),
        new TimingRecord(2, 1, 4, 175, "done"),
        new TimingRecord(5, 2, null, null, "dns"),
        new TimingRecord(3, 1, 1, 122, "done"),
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 3, stage: 1, position: 1,   time: 122, status: "done"},
        {bib: 1, stage: 1, position: 2,   time: 150, status: "done"},
        {bib: 2, stage: 1, position: 4,   time: 175, status: "done"},
        {bib: 5, stage: 1, position: null, time: null, status: "unknown"},
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
        new TimingRecord(2, 1, 4,   null,    "dnf"),
        new TimingRecord(3, 1, 1,   120,    "done"),
        new TimingRecord(5, 1, 3,   122,    "done"),
        new TimingRecord(1, 2, 3,   135,    "done"),
        new TimingRecord(3, 2, 1,   133,    "done"),
        new TimingRecord(5, 2, 4,   null,    "dns"),
    ];

    const sut = new RankingManager(ranking, bibs, stage);
    
    const actual = sut.General.map((g) => g.toObject());
    expect(actual).toMatchObject([
        {bib:3, position:2,   stage:2,   time:253,    status:'done'},
        {bib:1, position:5,   stage:2,   time:257,    status:'done'},
        {bib:5, position:7,   stage:2,   time:122,    status:'dns'},
        {bib:2, position:4,   stage:1,   time:null,   status:'dnf'},
    ]);
    
  });

  it('Update - As called from RaceModel', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1,2,3,5];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 2,   time: 150, status: "done"},
        {bib: 2, stage:1, position: 4,   time: 175, status: "done"},
        {bib: 3, stage:1, position: 1,   time: 122, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 3, stage: 1, position: 1,   time: 122, status: "done"},
        {bib: 1, stage: 1, position: 2,   time: 150, status: "done"},
        {bib: 2, stage: 1, position: 4,   time: 175, status: "done"},
        {bib: 5, stage: 1, position: null, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1,2,3,5]);
    
  });

  it('Update - Invalid position empty', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: [],   time: 23, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: null, time: 23, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid position null', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: null,   time: 23, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: null, time: 23, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid position numeric', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: -2,   time: 23, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: null, time: 23, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid position empty string', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: "",   time: 23, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: null, time: 23, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid position string cannot be converted to number', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: "none",   time: 23, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: null, time: 23, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid time empty', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 1,   time: [], status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 1, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid time nan', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 1,   time: null, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 1, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid time negative', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 1,   time: -1, status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 1, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid time empty string', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 1,   time: "", status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 1, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

  it('Update - Invalid time string cannot be converted to number', () => {

    const sut = new RankingManager();
    sut.Bibs  = [1];
    sut.Stage = 1;

    const actual = sut.update([
        {bib: 1, stage:1, position: 1,   time: "none", status: "done"},
    ]);
    
    expect(actual.Ranking.map((r) => r.toObject())).toMatchObject([
        {bib: 1, stage: 1, position: 1, time: null, status: "unknown"},
    ]);
    expect(actual.Bibs).toEqual([1]);
    
  });

});