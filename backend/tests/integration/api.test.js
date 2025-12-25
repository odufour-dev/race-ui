import request from 'supertest';
import { jest } from '@jest/globals';

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath }    from 'url';
import { dirname }          from 'path';
import { createApp } from '../../src/app.js';
import { create } from 'domain';

describe('End-to-end tests', () => {   
  
  let httpServer;
  let dbConnector;
  let masterdb;
  let __dirname;
  let TEST_DB_DIR;
  
  beforeAll(() => {

    const mockLogger = {
      log:    jest.fn(),
      debug:  jest.fn(),
      error:  jest.fn()
    };
    __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
    TEST_DB_DIR = path.join(__dirname, 'test_db');
    if (!fs.existsSync(TEST_DB_DIR)) fs.mkdirSync(TEST_DB_DIR, {recursive: true});

    // Start the server
    const app = createApp(__dirname,"test_db","/api/v1",5000,"../src/schema.sql","../../frontend/build",mockLogger);
    httpServer = app.httpServer;
    dbConnector = app.dbConnector;

  });

  beforeEach(() => {
    masterdb = dbConnector.getDatabase("master"); 
    masterdb.prepare('DELETE FROM competitions').run();
  });

  // Delete files and folder after tests
  afterAll((done) => {

    httpServer.close(() => {done();});

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

    const competitions = masterdb.prepare('SELECT * FROM competitions').all();
    expect(competitions).toEqual([]);

  });

  test('List competitions', async () => {

    // [ SETUP ]
    const competitions = [{id:"paris_nice_2026", name:"Paris-Nice 2026"},{id:"tour_auvergne_rhone_alpes_2026",name:"Tour Auvergne-Rhone-Alpes 2026"},{id:"tour_de_france_2026",name:"Tour de France 2026"}];
    const masterTransaction = masterdb.transaction((data) => {
      const insert = masterdb.prepare('INSERT INTO competitions (id, name) VALUES (?, ?)');
      data.map((d) => insert.run(d.id, d.name));
    });
    masterTransaction(competitions);

    // [ EXERCISE ]
    const response = await request(httpServer)
      .get('/api/v1/competitions');

    // [ VERIFY ]
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
    expect.arrayContaining([
      expect.objectContaining(competitions[0]),
      expect.objectContaining(competitions[1]),
      expect.objectContaining(competitions[2])
    ])
  );   

  });

  test('Create a dedicated database for a competition', async () => {

    // [ SETUP ]
    const compId = 'tour_de_france_2026';
    const dbPath = path.join(TEST_DB_DIR, `${compId}.db`);

    // [ EXERCISE ]
    const response = await request(httpServer)
      .post('/api/v1/competitions')
      .send({ name: 'Tour de France 2026' });

    // [ VERIFY ]
    expect(response.status).toBe(201);
    expect(response.body.id).toBe(compId);

    const competitions = masterdb.prepare('SELECT * FROM competitions').all();
    const createdComp = competitions.find(c => c.id === compId);
    expect(createdComp).toBeDefined();
    expect(createdComp.name).toBe('Tour de France 2026');

    const exists = fs.existsSync(dbPath);
    expect(exists).toBe(true);
    
    const compdb = new Database(dbPath);
    const metadata = compdb.prepare('SELECT * FROM metadata').all();
    const metadataVal = metadata.find(c => c.id === compId);
    expect(metadataVal).toBeDefined();
    expect(metadataVal.name).toBe('Tour de France 2026');
    compdb.close();

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