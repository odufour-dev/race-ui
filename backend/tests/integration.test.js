import request from 'supertest';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath }    from 'url';
import { dirname }          from 'path';
import { createApp } from '../src/app.js';
import { create } from 'domain';

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DB_DIR = path.join(__dirname, 'test_db');
const app = createApp(__dirname,"test_db","/api/v1",5000,"../src/schema.sql","../../../frontend/build");

describe('End-to-end tests', () => {    
  
  // Create temporary folder for tests
  beforeAll(() => {
    if (!fs.existsSync(TEST_DB_DIR)) fs.mkdirSync(TEST_DB_DIR, {recursive: true});
  });

  // Delete files and folder after tests
  afterAll(() => {
    const files = fs.readdirSync(TEST_DB_DIR);
    for (const file of files) {
      fs.unlinkSync(path.join(TEST_DB_DIR, file));
    }
    fs.rmdirSync(TEST_DB_DIR);
  });

  test('Create a dedicated database for a competition', async () => {

    // [ SETUP ]
    const compId = 'tour_de_france_2026';
    const dbPath = path.join(TEST_DB_DIR, `${compId}.db`);

    // [ EXERCISE ]
    const response = await request(app)
      .post('/api/v1/competitions')
      .send({ name: 'Tour de France 2026' });

    expect(response.status).toBe(201);

    // [ VERIFY ]
    expect(fs.existsSync(dbPath)).toBe(true);
/*
    const db = new Database(dbPath);
    const config = db.prepare('SELECT * FROM settings WHERE key = ?').get('name');
    
    expect(config.value).toBe('Tour de France 2026');
    db.close();
    */

  });

});