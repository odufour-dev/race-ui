import { RacerManager } from "./RacerManager"

import { Racer } from "./Racer"

describe('RacerManager', () => {

  it('Constructor - default', () => {

    const sut = new RacerManager();

    expect(sut.length).toEqual(0);
    expect(sut.getAll()).toEqual([]);

  });

  it('Clone', () => {

    const racers = [{id: 1},{id: 2}];

    const sut = new RacerManager(racers);
    const actual = sut.clone();

    expect(actual.getAll()).toEqual(sut.getAll());

  });

  it('Get fields - default', () => {

    const sut = new RacerManager();

    expect(sut.getFields()).toEqual(['id', 'firstName', 'lastName', 'sex', 'age', 'category', 'subcategory', 'club', 'uciID', 'ffcID']);

  });

  it('Add racer', () => {

    const sut = new RacerManager();

    const actual = sut.add({id:12, firstName: "Paul", lastName: "POULE", sex: "H", age: 26});

    expect(sut.length).toEqual(1);
    
    const expected_racer = new Racer(12, "Paul", "POULE", "H", 26);
    expect(actual.getAll()[0]).toEqual(expected_racer);

  });

  it('Clear', () => {

    const racers = [{id: 1},{id: 2}];

    const sut = new RacerManager(racers);
    const actual = sut.clear();

    expect(actual.length).toEqual(0);
    expect(actual.getAll()).toEqual([]);

  });

});