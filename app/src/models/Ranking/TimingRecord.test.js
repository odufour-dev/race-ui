import { TimingRecord }     from "./TimingRecord";

describe('TimingRecord', () => {

  it('Constructor - default', () => {

    const sut = new TimingRecord();

    expect(sut.bib).toEqual(0);
    expect(sut.stage).toEqual(1);
    expect(sut.position).toEqual(0);
    expect(sut.time).toBeNull();
    expect(sut.status).toEqual("unknown");

  });

  it('[SET/GET] bib - Number', () => {

    const sut = new TimingRecord();

    sut.bib = 34;
    expect(sut.bib).toEqual(34);
    
  });

  it('[SET/GET] bib - String', () => {

    const sut = new TimingRecord();

    sut.bib = "34";
    expect(sut.bib).toEqual(34);
    
  });

  it('[SET/GET] position - Number', () => {

    const sut = new TimingRecord();

    sut.position = 34;
    expect(sut.position).toEqual(34);
    
  });

  it('[SET/GET] position - String', () => {

    const sut = new TimingRecord();

    sut.position = "34";
    expect(sut.position).toEqual(34);
    
  });

  it('[SET/GET] stage - Number', () => {

    const sut = new TimingRecord();

    sut.stage = 3;
    expect(sut.stage).toEqual(3);
    
  });

  it('[SET/GET] stage - String', () => {

    const sut = new TimingRecord();

    sut.stage = "3";
    expect(sut.stage).toEqual(3);
    
  });

  it('[SET/GET] status', () => {

    const sut = new TimingRecord();

    sut.status = "done";
    expect(sut.status).toEqual("done");
    
  });

  it('[SET/GET] time - Number', () => {

    const sut = new TimingRecord();

    sut.time = 3654;
    expect(sut.time).toEqual(3654);
    
  });

  it('[SET/GET] time - String', () => {

    const sut = new TimingRecord();

    sut.time = "01:00:54";
    expect(sut.time).toEqual(3654);
    
  });

  it('[SET/GET] time - Empty', () => {

    const sut = new TimingRecord();

    sut.time = [];
    expect(sut.time).toEqual([]);
    
  });

  it('[SET/GET] time - null', () => {

    const sut = new TimingRecord();

    sut.time = null;
    expect(sut.time).toBeNull();
    
  });

  it('[SET/GET] time - negative value', () => {

    const sut = new TimingRecord();

    sut.time = -1;
    expect(sut.time).toEqual(-1);
    
  });

  it('[SET/GET] time - empty string', () => {

    const sut = new TimingRecord();

    sut.time = "";
    expect(sut.time).toBeNull();
    
  });

  it('[SET/GET] time - non numeric string', () => {

    const sut = new TimingRecord();

    sut.time = "none";
    expect(sut.time).toBeNull();
    
  });

  it('Update - Native types', () => {

    const sut = new TimingRecord();

    sut.update({bib: 5, stage: 2, position: 12, status: "done", time: 3605});

    expect(sut.bib).toEqual(5);
    expect(sut.stage).toEqual(2);
    expect(sut.position).toEqual(12);
    expect(sut.status).toEqual("done");
    expect(sut.time).toEqual(3605);

  });

  it('Update - Strings', () => {

    const sut = new TimingRecord();

    sut.update({bib: "5", stage: "2", position: "12", status: "done", time: "01:00:04"});

    expect(sut.bib).toEqual(5);
    expect(sut.stage).toEqual(2);
    expect(sut.position).toEqual(12);
    expect(sut.status).toEqual("done");
    expect(sut.time).toEqual(3604);

  });

});