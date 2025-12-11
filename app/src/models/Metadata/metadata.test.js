
import { Metadata } from "./Metadata"

describe('Metadata', () => {

  it('Constructor - default', () => {

    const sut = new Metadata();

    expect(sut.branch).toEqual("");
    expect(sut.commit).toEqual("");
    expect(sut.date).toEqual("");
    expect(sut.name).toEqual("");
    expect(sut.version).toEqual("");
    expect(sut.fullName).toEqual("");
    
  });

})
