import { jest } from '@jest/globals';
import Database from '../../src/database/database.js';

describe('Database', () => {

  it('Constructor - default', () => {

    const sut = new Database();
    expect(sut).toBeDefined();

  });
/*
  it('Constructor - with mocks', () => {

    const toolsMock = {};
    const dbfolderMock = "";
    const schemapathMock = "";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    expect(sut).toBeDefined();

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

  it('createCompetition', () => {

    const getSafeDatabaseNameMock   = jest.fn().mockReturnValue("tour_de_france_2026");
    const joinAbsolutePathMock      = jest.fn().mockReturnValue("/data/db/tour_de_france_2026.db");
    const readAbsoluteFileMock      = jest.fn().mockReturnValue("schemaMock");
    const isDatabaseExistsMock      = jest.fn().mockReturnValue(false);
    
    const dbInsertMock      = {run: jest.fn()};
    const dbPrepareMock     = jest.fn().mockReturnValue(dbInsertMock);
    const dbTransationMock  = jest.fn().mockImplementation((arg) => arg);
    const dbExecMock        = jest.fn();
    const dbMock = {exec: dbExecMock, transaction: dbTransationMock, prepare: dbPrepareMock};

    const getDatabaseMock = jest.fn().mockReturnValue(dbMock);
    const toolsMock = {files: {getSafeDatabaseName: getSafeDatabaseNameMock, joinAbsolutePath:joinAbsolutePathMock,readAbsoluteFile:readAbsoluteFileMock}, connector: {isDatabaseExists: isDatabaseExistsMock, getDatabase: getDatabaseMock}};

    const dbfolderMock = "db";
    const schemapathMock = "schemaMock.sql";

    const sut = new Database(toolsMock,dbfolderMock,schemapathMock);
    const actual = sut.createCompetition("Tour de France 2026");
    expect(actual).toBe("tour_de_france_2026");
    
    expect(getDatabaseMock).toHaveBeenCalledWith("/data/db/tour_de_france_2026.db");
    expect(readAbsoluteFileMock).toHaveBeenCalledWith(schemapathMock, "utf8");
    expect(dbExecMock).toHaveBeenCalledWith("schemaMock");

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
*/
});