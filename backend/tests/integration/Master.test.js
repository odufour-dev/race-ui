import { jest }         from '@jest/globals';
import { openMaster }   from './../../src/database/master/Master.js';

import { Sequelize }    from 'sequelize';
import sqlite3          from 'sqlite3';

describe('Database Integration Tests', () => {

    let db;
    let driver;

    jest.setTimeout(10000);

    beforeAll(async () => {
        driver = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            dialectModule: sqlite3
        });
        db = openMaster(driver);
    });

    beforeEach(async () => {
        await driver.sync({ force: true });
    });

    afterAll(async () => {
        await driver.close();
    });

    it('Create a competition', async () => {

        // [ EXERCISE ]
        await db.registerCompetition("Tour de France 2026", "tour_de_france_2026.db",1);
        const allRaces = await db.getAllCompetitions();

        // [ VERIFY ]
        expect(allRaces).toHaveLength(1);
        expect(allRaces[0].name).toBe("Tour de France 2026");
        expect(allRaces[0].filename).toBe("tour_de_france_2026.db");
        expect(allRaces[0].status).toBe("active");

    });

});