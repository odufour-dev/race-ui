import { jest } from '@jest/globals';
import Database from '../../src/database/database.js';

describe('Database', () => {

  it('Constructor - default', () => {

    const sut = new Database();
    expect(sut).toBeDefined();

  });

  it('Constructor - with mocks', () => {

    const toolsMock = {};
    const dbfolderMock = "";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    expect(sut).toBeDefined();

  });

  it('getSafeDatabasePath', () => {

    const getSafeDatabaseNameMock = jest.fn().mockReturnValue("tour_de_france_2026");
    const joinAbsolutePathMock = jest.fn().mockReturnValue("/data/db/tour_de_france_2026.db");
    const toolsMock = {files: {getSafeDatabaseName: getSafeDatabaseNameMock, joinAbsolutePath:joinAbsolutePathMock}};

    const dbfolderMock = "db";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    const actual = sut.getSafeDatabasePath("Tour de France 2026");

    expect(getSafeDatabaseNameMock).toHaveBeenCalledWith("Tour de France 2026");
    expect(joinAbsolutePathMock).toHaveBeenCalledWith(dbfolderMock, "tour_de_france_2026.db");

    expect(actual).toBe("/data/db/tour_de_france_2026.db");

  });

  it('listCompetitions - empty', () => {

    const readAbsoluteDirMock = jest.fn().mockReturnValue([]);
    const toolsMock = {files: {readAbsoluteDir: readAbsoluteDirMock}};

    const dbfolderMock = "db";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    const actual = sut.listCompetitions();

    expect(readAbsoluteDirMock).toHaveBeenCalledWith(dbfolderMock);

    expect(actual).toEqual([]);

  });

  it('listCompetitions - no DB file', () => {

    const readAbsoluteDirMock = jest.fn().mockReturnValue(["data.txt","value.log"]);
    const toolsMock = {files: {readAbsoluteDir: readAbsoluteDirMock}};

    const dbfolderMock = "db";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    const actual = sut.listCompetitions();

    expect(readAbsoluteDirMock).toHaveBeenCalledWith(dbfolderMock);

    expect(actual).toEqual([]);

  });

  it('listCompetitions', () => {

    const readAbsoluteDirMock = jest.fn().mockReturnValue(["data.db","value.db"]);
    const toolsMock = {files: {readAbsoluteDir: readAbsoluteDirMock}};

    const dbfolderMock = "db";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    const actual = sut.listCompetitions();

    expect(readAbsoluteDirMock).toHaveBeenCalledWith(dbfolderMock);

    expect(actual).toEqual([{id:"data",name:"data"},{id:"value",name:"value"}]);

  });

  it('createCompetition - ERROR EXIST', () => {

    const getSafeDatabaseNameMock = jest.fn().mockReturnValue("tour_de_france_2026");
    const joinAbsolutePathMock = jest.fn().mockReturnValue("/data/db/tour_de_france_2026.db");
    const isDatabaseExistsMock = jest.fn().mockReturnValue(true);
    const toolsMock = {files: {getSafeDatabaseName: getSafeDatabaseNameMock, joinAbsolutePath:joinAbsolutePathMock}, connector: {isDatabaseExists: isDatabaseExistsMock}};

    const dbfolderMock = "db";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    
    expect(() => sut.createCompetition()).toThrow('EXIST_ERROR');

  });

});