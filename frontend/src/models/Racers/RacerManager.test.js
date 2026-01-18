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
    sut.clear();

    expect(sut.length).toEqual(0);
    expect(sut.getAll()).toEqual([]);

  });

  it('Update', () => {

    const data = [
      {
        id: 1,
        firstName: "Jean",
        lastName: "Dupont",
        team: "Team France Cyclisme",
        category: "Elite",
        ffcID: "FFC123456",
        uciID: "UCI123456789",
        sex: "men",
        bib: 1
      },
      {
        id: 2,
        firstName: "Marie",
        lastName: "Bernard",
        team: "Vélo Club Lyon",
        category: "U23",
        ffcID: "FFC654321",
        uciID: "UCI987654321",
        sex: "women",
        bib: 2
      },
      {
        id: 3,
        firstName: "Pierre",
        lastName: "Moreau",
        team: "Cycling Academy Paris",
        category: "Junior",
        ffcID: "FFC111222",
        uciID: "UCI111222333",
        sex: "men",
        bib: 3
      },
      {
        id: 4,
        firstName: "Sophie",
        lastName: "Laurent",
        team: "Team France Cyclisme",
        category: "Elite",
        ffcID: "FFC333444",
        uciID: "UCI444555666",
        sex: "women",
        bib: 4
      },
      {
        id: 5,
        firstName: "Lucas",
        lastName: "Renard",
        team: "Bordeaux Vélo Club",
        category: "U23",
        ffcID: "FFC555666",
        uciID: "UCI777888999",
        sex: "men",
        bib: 5
      },
      {
        id: 6,
        firstName: "Amélie",
        lastName: "Rousseau",
        team: "Provence Cycling",
        category: "Junior",
        ffcID: "FFC777888",
        uciID: "UCI222333444",
        sex: "women",
        bib: 6
      },
      {
        id: 7,
        firstName: "François",
        lastName: "Petit",
        team: "Marseille CC",
        category: "Elite",
        ffcID: "FFC999000",
        uciID: "UCI555666777",
        sex: "men",
        bib: 7
      },
      {
        id: 8,
        firstName: "Claire",
        lastName: "Lefevre",
        team: "Team France Cyclisme",
        category: "U23",
        ffcID: "FFC111333",
        uciID: "UCI888999000",
        sex: "women",
        bib: 8
      }
    ];

    const sut = new RacerManager();
    const actual = sut.update(data);

    expect(actual.length).toEqual(8);
    expect(actual.getAll()[0]).toEqual(new Racer(1, "Jean", "Dupont", "men", 0, "Elite", "", "UCI123456789", "FFC123456"));
    expect(actual.getAll()[1]).toEqual(new Racer(2, "Marie  ", "Bernard", "women", 0, "U23", "", "UCI987654321", "FFC654321"));
    expect(actual.getAll()[2]).toEqual(new Racer(3, "Pierre", "Moreau", "men", 0, "Junior", "", "UCI111222333", "FFC111222"));
    expect(actual.getAll()[3]).toEqual(new Racer(4, "Sophie", "Laurent", "women", 0, "Elite", "", "UCI444555666", "FFC333444"));
    expect(actual.getAll()[4]).toEqual(new Racer(5, "Lucas", "Renard", "men", 0, "U23", "", "UCI777888999", "FFC555666"));
    expect(actual.getAll()[5]).toEqual(new Racer(6, "Amélie", "Rousseau", "women", 0, "Junior", "", "UCI222333444", "FFC777888"));
    expect(actual.getAll()[6]).toEqual(new Racer(7, "François", "Petit", "men", 0, "Elite", "", "UCI555666777", "FFC999000"));
    expect(actual.getAll()[7]).toEqual(new Racer(8, "Claire", "Lefevre", "women", 0, "U23", "", "UCI888999000", "FFC111333"));

  });

});