import { jest }                 from '@jest/globals';
import { createCompetition }    from './../../src/database/competition.js';
import sqlite3                  from 'sqlite3';

describe('Database Integration Tests', () => {

    let db;

    jest.setTimeout(10000);

    beforeAll(async () => {
        db = createCompetition('test-db', ':memory:', sqlite3);
    });

    beforeEach(async () => {
        await db.sync({ force: true });
    });

    afterAll(async () => {
        await db.close();
    });

    it('Create a race and stages (Relation One-to-Many)', async () => {
        
        const Race  = db.Race;
        const Stage = db.Stage;

        const race  = await Race.create({ name: 'Tour de France' });
        const stage = await Stage.create({ 
            name: 'Étape 1', 
            distance: 150,
            raceId: race.id 
        });

        // Verify with Eager Loading
        const raceWithStages = await Race.findByPk(race.id, { include: "Stages" });
        
        expect(raceWithStages.name).toBe('Tour de France');
        expect(raceWithStages.Stages).toHaveLength(1);
        expect(raceWithStages.Stages[0].name).toBe('Étape 1');

    });

    it('Register a racer to a race (Relation Many-to-Many)', async () => {
        
        const Race  = db.Race;
        const Racer = db.Racer;

        const race  = await Race.create({ name: 'Paris-Roubaix' });
        const racer = await Racer.create({ firstName: 'Eddy', lastName: 'Merckx' });

        await race.addRacer(racer);

        const raceWithParticipants = await Race.findByPk(race.id, { include: "Racers" });
        
        expect(raceWithParticipants.Racers).toHaveLength(1);
        expect(raceWithParticipants.Racers[0].lastName).toBe('Merckx');

    });

    it('Delete all stages when a race is deleted', async () => {
        
        const Race  = db.Race;
        const Stage = db.Stage;

        const race = await Race.create({ name: 'Course Éphémère' });
        await Stage.create({ name: 'Étape Unique', raceId: race.id });

        // Delete
        await race.destroy();

        const stageCount = await Stage.count({ where: { name: 'Étape Unique' } });
        expect(stageCount).toBe(0);

    });

    it('Link results to a racer and a stage', async () => {
        
        const Race      = db.Race;
        const Stage     = db.Stage;
        const Racer     = db.Racer;
        const Results   = db.Results;

        const race  = await Race.create({ name: 'Critérium' });
        const stage = await Stage.create({ name: 'Prologue', raceId: race.id });
        const racer = await Racer.create({ firstName: 'Bernard', lastName: 'Hinault' });
        
        const result = await Results.create({
            time: '00:15:30',
            stageId: stage.id,
            racerId: racer.id
        });

        expect(result.racerId).toBe(racer.id);
        expect(result.stageId).toBe(stage.id);

    });

});