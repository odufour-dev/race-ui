
import { Racer } from "./Racer"

describe('Racer', () => {

  it('Constructor - default', () => {

    const sut = new Racer();

    expect(sut.age).toEqual(0);
    expect(sut.category).toEqual("");
    expect(sut.club).toEqual("");
    expect(sut.ffcID).toEqual("");
    expect(sut.firstName).toEqual("");
    expect(sut.fullName).toEqual(" ");
    expect(sut.id).toEqual(0);
    expect(sut.lastName).toEqual("");
    expect(sut.sex).toEqual("");
    expect(sut.uciID).toEqual("");

  });

  it('[SET/GET] Age', () => {

    const sut = new Racer();
    sut.age = 25;
    expect(sut.age).toEqual(25);

  });

  it('[SET/GET] Age', () => {

    const sut = new Racer();
    sut.age = 25;
    expect(sut.age).toEqual(25);

  });

  it('[SET/GET] Category', () => {

    const sut = new Racer();
    sut.category = "open2";
    expect(sut.category).toEqual("open2");

  });

  it('[SET/GET] Club', () => {

    const sut = new Racer();
    sut.club = "V.C. Best";
    expect(sut.club).toEqual("V.C. Best");

  });

  it('[SET/GET] FFC ID', () => {

    const sut = new Racer();
    sut.ffcID = "41420051239";
    expect(sut.ffcID).toEqual("41420051239");

  });

  it('[SET/GET] First Name', () => {

    const sut = new Racer();
    sut.firstName = "Paul";
    expect(sut.firstName).toEqual("Paul");

  });

  it('[SET/GET] ID', () => {

    const sut = new Racer();
    sut.id = 42;
    expect(sut.id).toEqual(42);

  });

  it('[SET/GET] Last Name', () => {

    const sut = new Racer();
    sut.lastName = "POULE";
    expect(sut.lastName).toEqual("POULE");

  });

  it('[SET/GET] Sex', () => {

    const sut = new Racer();
    sut.sex = "F";
    expect(sut.sex).toEqual("F");

  });

  it('[SET/GET] UCI ID', () => {

    const sut = new Racer();
    sut.uciID = "22236548974";
    expect(sut.uciID).toEqual("22236548974");

  });

  it('setProperty - Existing', () => {

    const sut = new Racer();
    sut.setProperty("id", 26);
    expect(sut.id).toEqual(26);

  });

  it('setProperty - NOT Existing', () => {

    const sut = new Racer();
    sut.setProperty("unknown", "new value");
    
    expect(sut.age).toEqual(0);
    expect(sut.category).toEqual("");
    expect(sut.club).toEqual("");
    expect(sut.ffcID).toEqual("");
    expect(sut.firstName).toEqual("");
    expect(sut.fullName).toEqual(" ");
    expect(sut.id).toEqual(0);
    expect(sut.lastName).toEqual("");
    expect(sut.sex).toEqual("");
    expect(sut.uciID).toEqual("");

  });


});