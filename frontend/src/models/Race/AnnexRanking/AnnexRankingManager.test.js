
import { AnnexRankingManager }    from './AnnexRankingManager';

describe('AnnexRankingManager', () => {

  it('Constructor - default', () => {

    const sut = new AnnexRankingManager();
    expect(sut.list).toEqual(["points", "team", "filter"]);

  });

  it('From JSON', () => {

    const data = [
    {
        name: "points",
        type: "points",
        priority: 1,
        categories: [
        {
            name: "sprint",
            points: [5, 3, 1]
        }
        ]
    },
    {
        name: "GPM",
        type: "points",
        priority: 2,
        categories: [
        {
            name: "cat1",
            points: [5, 3, 1]
        },
        {
            name: "cat2",
            points: [3, 1]
        }
        ]
    },
    {
        name: "Jeunes",
        type: "filter",
        priority: 3,
        filter: "age < 23"
    },
    {
        name: "Equipe",
        type: "team",
        priority: 4,
        nracers: "2"
    }
    ];

    const sut = new AnnexRankingManager();
    const actual = sut.fromJSON(data);

    expect(actual.length).toBe(4);
    expect(actual[0].toJSON()).toEqual({
        name: "points",
        type: "points",
        title: "points",
        priority: 1,
        categories: [{name:"sprint",points:[5, 3, 1]}]
    });
    expect(actual[1].toJSON()).toEqual({
        name: "GPM",
        type: "points",
        title: "GPM",
        priority: 2,
        categories: [{name:"cat1",points:[5, 3, 1]}, {name:"cat2",points:[3, 1]}]
    });
    expect(actual[2].toJSON()).toEqual({
        filter: "age < 23",
        name: "Jeunes",
        type: "filter",
        title: "Jeunes",
        priority: 3,
    });
    expect(actual[3].toJSON()).toEqual({
        name: "Equipe",
        type: "team",
        title: "Equipe",
        priority: 4,
        nracers: 2
    });

  });

});