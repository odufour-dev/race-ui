import { jest } from '@jest/globals';
import {APIRouter, StaticRouter} from '../../../src/routes/routers.js';

describe('APIRouter', () => {

  it('Constructor - default', () => {

    const sut = new APIRouter();
    expect(sut).toBeDefined();

  });

  it('Constructor - with mock', () => {

    const toolsMock     = {};
    const databaseMock  = {};

    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');
    expect(sut).toBeDefined();
    
  });

  it('Register', () => {

    const getMock               = jest.fn();
    const postMock              = jest.fn();
    const registerRoutesMock    = jest.fn();

    const toolsMock     = {express: {router: {get: getMock, post: postMock}, registerRoutes: registerRoutesMock}};
    const databaseMock  = {};

    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');
    sut.register();

    expect(getMock).toHaveBeenCalledTimes(2);
    expect(getMock).toHaveBeenCalledWith('/version', expect.any(Function));
    expect(getMock).toHaveBeenCalledWith('/competitions', expect.any(Function));

    expect(postMock).toHaveBeenCalledTimes(2);
    expect(postMock).toHaveBeenCalledWith('/:competition/racers/sync', expect.any(Function));
    expect(postMock).toHaveBeenCalledWith('/competitions', expect.any(Function));

    expect(registerRoutesMock).toHaveBeenCalledTimes(1);
    
  });

  it('Get Version', () => {

    const resMock = {json: jest.fn()};

    const toolsMock     = {};
    const databaseMock  = {readConfiguration: jest.fn().mockReturnValue({version: "0.0.0",name:"test"})};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.getVersion({}, resMock);

    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith({ version: '0.0.0', name: "test", status: 'ok' });

  });

  it('Get competitions', () => {

    const expected = [ { id: 'tour_de_france_2026', name: 'tour_de_france_2026' } ];

    const resMock = {json: jest.fn()};

    const toolsMock     = {};
    const databaseMock  = {listCompetitions: jest.fn().mockReturnValue(expected)};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.getCompetitions({}, resMock);

    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith(expected);

  });

  it('Get competitions - ERROR', () => {

    const expected  = new Error("DB_ERROR");
    const jsonMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {json: jsonMock, status: statusMock};

    const toolsMock     = {};
    const databaseMock  = {listCompetitions: jest.fn().mockImplementation(() => { throw expected; })};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.getCompetitions({}, resMock);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: expected.message });

  });

  it('Create competition', () => {

    const expected = 'tour_de_france_2026';

    const jsonMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {json: jsonMock, status: statusMock};

    const toolsMock     = {};
    const databaseMock  = {createCompetition: jest.fn().mockReturnValue(expected)};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.createCompetition({body: {name: "Tour de France 2026"}}, resMock);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(resMock.json).toHaveBeenCalledTimes(1);
    expect(resMock.json).toHaveBeenCalledWith( {id: expected});

  });

  it('Create competition - ERROR EXIST', () => {

    const expected  = new Error("EXIST_ERROR");
    const jsonMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {json: jsonMock, status: statusMock};

    const toolsMock     = {};
    const databaseMock  = {createCompetition: jest.fn().mockImplementation(() => { throw expected; })};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.createCompetition({body: {name: "Tour de France 2026"}}, resMock);

    expect(statusMock).toHaveBeenCalledWith(409);
    expect(jsonMock).toHaveBeenCalledWith({ error: expected.message });

  });

  it('Create competition - ERROR', () => {

    const expected  = new Error("UNKNOWN_ERROR");
    const jsonMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {json: jsonMock, status: statusMock};

    const toolsMock     = {};
    const databaseMock  = {createCompetition: jest.fn().mockImplementation(() => { throw expected; })};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.createCompetition({body: {name: "Tour de France 2026"}}, resMock);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: expected.message });

  });

  it('Sync racers', () => {

    const jsonMock  = jest.fn();
    const resMock = {json: jsonMock};

    const toolsMock     = {};
    const databaseMock  = {syncRacers: jest.fn()};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.syncRacers({params: {competition: "tour_de_france_2026"}, body: {racers: []}}, resMock);

    expect(jsonMock).toHaveBeenCalledWith({ message: "OK" });

  });

  it('Sync racers - ERROR', () => {

    const expected  = new Error("UNKNOWN_ERROR");
    const jsonMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {json: jsonMock, status: statusMock};

    const toolsMock     = {};
    const databaseMock  = {syncRacers: jest.fn().mockImplementation(() => { throw expected; })};
    const sut = new APIRouter(toolsMock, databaseMock, '/api/v1');

    sut.syncRacers({params: {competition: "tour_de_france_2026"}, body: {racers: []}}, resMock);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({ error: expected.message });

  });

});

describe('StaticRouter', () => {

  it('Constructor - default', () => {

    const sut = new StaticRouter();
    expect(sut).toBeDefined();

  });

  it('Constructor - with mocks', () => {

    const filepathsMock = '/path/to/build';
    const toolsMock     = {};

    const sut = new StaticRouter(toolsMock, filepathsMock);
    expect(sut).toBeDefined();

  });

  it('register', () => {

    const filepathsMock = '/path/to/build';
    const toolsMock     = {express: {registerStatic: jest.fn()}};

    const sut = new StaticRouter(toolsMock, filepathsMock);
    sut.register();

    expect(toolsMock.express.registerStatic).toHaveBeenCalledTimes(1);
    expect(toolsMock.express.registerStatic).toHaveBeenCalledWith(filepathsMock, expect.any(Function));

  });

  it('sendFile', () => {

    const sendFileMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {sendFile: sendFileMock, status: statusMock};

    const filepathsMock = '/path/to/build';

    const joinAbsolutePathMock = jest.fn().mockReturnValue('/path/to/build/index.html');
    const existsMock = jest.fn().mockReturnValue(true);
    const toolsMock     = {files: {joinAbsolutePath: joinAbsolutePathMock, exists: existsMock}};

    const sut = new StaticRouter(toolsMock, filepathsMock);
    sut.sendFile({}, resMock);

    expect(joinAbsolutePathMock).toHaveBeenCalledTimes(1);
    expect(joinAbsolutePathMock).toHaveBeenCalledWith(filepathsMock, 'index.html');

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith('/path/to/build/index.html');

    expect(sendFileMock).toHaveBeenCalledTimes(1);
    expect(sendFileMock).toHaveBeenCalledWith('/path/to/build/index.html');

  });

  it('sendFile - NOT EXIST', () => {

    const sendMock  = jest.fn();
    const statusMock = jest.fn().mockReturnThis();
    const resMock = {send: sendMock, status: statusMock};

    const filepathsMock = '/path/to/build';

    const joinAbsolutePathMock = jest.fn().mockReturnValue('/path/to/build/index.html');
    const existsMock = jest.fn().mockReturnValue(false);
    const toolsMock     = {files: {joinAbsolutePath: joinAbsolutePathMock, exists: existsMock}};

    const sut = new StaticRouter(toolsMock, filepathsMock);
    sut.sendFile({}, resMock);

    expect(joinAbsolutePathMock).toHaveBeenCalledTimes(1);
    expect(joinAbsolutePathMock).toHaveBeenCalledWith(filepathsMock, 'index.html');

    expect(existsMock).toHaveBeenCalledTimes(1);
    expect(existsMock).toHaveBeenCalledWith('/path/to/build/index.html');

    expect(statusMock).toHaveBeenCalledTimes(1);
    expect(statusMock).toHaveBeenCalledWith(404);

    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock).toHaveBeenCalledWith('Build missing');

  });

});