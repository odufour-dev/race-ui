
import { Stage }    from './Stage';

describe('Stage', () => {

  it('Constructor - default', () => {

    const sut = new Stage();

    expect(sut.id).toEqual(1);
    expect(sut.name).toEqual("");
    expect(sut.date).toEqual("");
    expect(sut.distance).toEqual(0);

  });

  it('Clone', () => {

    const sut = new Stage(25, "Tour du vélo", "2026-05-18", 154);
    const actual = sut.clone();

    expect(actual.id).toEqual(25);
    expect(actual.name).toEqual("Tour du vélo");
    expect(actual.date).toEqual("2026-05-18");
    expect(actual.distance).toEqual(154);

  });

  it('Update', () => {

    const sut = new Stage();
    sut.update({id: 25, name: "Tour du vélo", date: "2026-05-18", distance: 154})

    expect(sut.id).toEqual(25);
    expect(sut.name).toEqual("Tour du vélo");
    expect(sut.date).toEqual("2026-05-18");
    expect(sut.distance).toEqual(154);

  });

});