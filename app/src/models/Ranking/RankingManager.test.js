import { RankingManager }   from "./RankingManager";
import { TimingRecord }     from "./TimingRecord";

describe('RankingManager', () => {

  it('getRanking - no timing - no stage', () => {

    const bibs = [1,2,3,4,5];
    const sut = new RankingManager();

    const actual = sut.getRanking(1, bibs);

    expect(actual).toEqual([
        new TimingRecord(1, 1, 999, NaN, "unknown"),
        new TimingRecord(2, 1, 999, NaN, "unknown"),
        new TimingRecord(3, 1, 999, NaN, "unknown"),
        new TimingRecord(4, 1, 999, NaN, "unknown"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ])

  });

  it('getRanking - perfect match', () => {

    const bibs = [1,2,3,4,5];
    const timings = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(timings);

    const actual = sut.getRanking(1, bibs);

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('getRanking - multiple stages', () => {

    const bibs = [1,2,3,4,5];
    const timings = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(timings);

    const actual = sut.getRanking(1, bibs);

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('getRanking - less bibs', () => {

    const bibs = [1,2,3];
    const timings = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
    ];
    const sut = new RankingManager(timings);

    const actual = sut.getRanking(1, bibs);

    expect(actual).toEqual([
        new TimingRecord(4, 1, 1, 120, "done"),
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(5, 1, 4, 130, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
    ])

  });

  it('getRanking - more bibs', () => {

    const bibs = [1,2,3,4,5];
    const timings = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(timings);

    const actual = sut.getRanking(1, bibs);

    expect(actual).toEqual([
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(4, 1, 999, NaN, "unknown"),
        new TimingRecord(5, 1, 999, NaN, "unknown"),
    ])

  });

  it('getRanking - Stage 2 - DNS/DNF/ABS', () => {

    const bibs = [1,2,3,4,5];
    const timings = [
        new TimingRecord(1, 1, 2, 122, "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 1, 999, NaN, "dnf"),
        new TimingRecord(5, 2, 1, 50, "done"),
        new TimingRecord(3, 1, 3, 122, "done"),
    ];
    const sut = new RankingManager(timings);

    const actual = sut.getRanking(2, bibs);

    expect(actual).toEqual([
        new TimingRecord(5, 2, 1, 50,   "done"),
        new TimingRecord(1, 2, 999, 122, "dns"),
        new TimingRecord(2, 2, 999, NaN, "abs"),
        new TimingRecord(3, 2, 999, NaN, "unknown"),
        new TimingRecord(4, 2, 999, NaN, "abs"),
    ])

  });

});