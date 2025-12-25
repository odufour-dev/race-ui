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
  let __dirname;
  let TEST_DB_DIR;
  
  // Create temporary folder for tests
  beforeAll(() => {

    const mockLogger = {
      log:    jest.fn(),
      debug:  jest.fn(),
      error:  jest.fn()
    };
    __dirname = dirname(dirname(fileURLToPath(import.meta.url)));
    TEST_DB_DIR = path.join(__dirname, 'test_db');
    if (!fs.existsSync(TEST_DB_DIR)) fs.mkdirSync(TEST_DB_DIR, {recursive: true});
    
    httpServer = createApp(__dirname,"test_db","/api/v1",5000,"../../src/schema.sql","../../../../frontend/build",mockLogger);

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

  test('Create a dedicated database for a competition', async () => {
return; // FIXME
    // [ SETUP ]
    const compId = 'tour_de_france_2026';
    const masterDbPath = path.join(TEST_DB_DIR, `master.db`);
    const dbPath = path.join(TEST_DB_DIR, `${compId}.db`);

    // [ EXERCISE ]
    const response = await request(httpServer)
      .post('/api/v1/competitions')
      .send({ name: 'Tour de France 2026' });

    // [ VERIFY ]
    expect(response.status).toBe(201);
    expect(response.body.id).toBe(compId);
console.log(fs.existsSync(masterDbPath) ? "OK" : "KO");
    const masterdb = new Database(masterDbPath);
    console.log(masterdb.prepare('SELECT * FROM competitions').all());
/*
    // Vérifier que la compétition existe dans la base Master
    const competitions = tools.database.listCompetitions();
    const createdComp = competitions.find(c => c.id === compId);

    expect(createdComp).toBeDefined();
    expect(createdComp.name).toBe('Tour de France 2026');
*/
  });
/*
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
*/
});