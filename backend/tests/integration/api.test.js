import request              from 'supertest';
import { jest }             from '@jest/globals';

import fs                   from 'fs';
import path                 from 'path';
import { fileURLToPath }    from 'url';
import { dirname }          from 'path';
import { createApp }        from '../../src/app.js';

describe('End-to-end tests', () => {   
  
  let httpServer;
  let dbConnector;
  let masterDriver;
  let __dirname;
  let TEST_DB_DIR;
  
  beforeAll(async () => {

    const mockLogger = {
      log:    jest.fn(),
      debug:  jest.fn(),
      error:  jest.fn()
    };
    __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
    TEST_DB_DIR = path.join(__dirname, 'test_db');
    if (!fs.existsSync(TEST_DB_DIR)) fs.mkdirSync(TEST_DB_DIR, {recursive: true});

    // Start the server
    const app = await createApp(__dirname,"test_db","/api/v1",5000,"../src/schema.sql","../../frontend/build",mockLogger);
    httpServer = app.httpServer;
    dbConnector = app.dbConnector;
    masterDriver = dbConnector.getDatabase('master');

  });

  beforeEach(async () => {
    // Clean up competitions from the existing database connector
    if (masterDriver) {
      try {
        await masterDriver.getQueryInterface().bulkDelete('competitions', {});
      } catch (e) {
        // Ignore if table does not exist yet
      }
    }
  });

  // Delete files and folder after tests
  afterAll((done) => {

    httpServer.close(() => {done();});

    // Close DB connections to release file handles before cleanup
    if (dbConnector && typeof dbConnector.closeAll === 'function') dbConnector.closeAll();

    const files = fs.readdirSync(TEST_DB_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(TEST_DB_DIR, file));
    }
    fs.rmdirSync(TEST_DB_DIR);

  });

  test('List competitions - EMPTY', async () => {

    // [ EXERCISE ]
    const response = await request(httpServer)
      .get('/api/v1/competitions');

    // [ VERIFY ]
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

  });

  test('List competitions', async () => {

    // [ SETUP ]
    const competitionNames = ["Paris-Nice 2026", "Tour Auvergne-Rhone-Alpes 2026", "Tour de France 2026"];
    for (const name of competitionNames) {
      await request(httpServer)
        .post('/api/v1/competitions')
        .send({ name });
    }

    // [ EXERCISE ]
    const response = await request(httpServer)
      .get('/api/v1/competitions');

    // [ VERIFY ]
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: competitionNames[0] }),
        expect.objectContaining({ name: competitionNames[1] }),
        expect.objectContaining({ name: competitionNames[2] })
      ])
    );   

  });

  test('Create a dedicated database for a competition', async () => {

    // [ SETUP ]
    const compId = 'tour_de_france_2025';
    const dbPath = path.join(TEST_DB_DIR, `${compId}.db`);

    // [ EXERCISE ]
    const response = await request(httpServer)
      .post('/api/v1/competitions')
      .send({ name: 'Tour de France 2025' });

    // [ VERIFY ]
    expect(response.status).toBe(201);
    expect(response.body.id).toBe(compId);

    // Verify the database file was created
    const exists = fs.existsSync(dbPath);
    expect(exists).toBe(true);

  });

  test('Should return 409 if competition already exists', async () => {
      
    // [ SETUP ]
    const name = 'Tour de France 2026';
      
    // [ EXERCISE ]
    // 1st call
    await request(httpServer).post('/api/v1/competitions').send({ name });
    
    // 2nd call
    const response = await request(httpServer).post('/api/v1/competitions').send({ name });

    // [ VERIFY ]
    expect(response.status).toBe(409);
    expect(response.body.error).toBe('EXIST_ERROR');

  });

});