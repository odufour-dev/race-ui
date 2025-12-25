import { jest } from '@jest/globals';
import Database from '../../src/database/database.js';

describe('Database Class', () => {
    let mockTools;
    let mockMasterDb;
    let mockCompDb;
    let database;
    const SCHEMA_PATH = '/path/to/schema.sql';
    const SCHEMA_CONTENT = 'CREATE TABLE racers...';

    beforeEach(() => {
        // Mock d'une instance de base de données SQLite (better-sqlite3)
        const createMockDb = () => ({
            exec: jest.fn(),
            prepare: jest.fn().mockReturnValue({
                run: jest.fn(),
                all: jest.fn().mockReturnValue([])
            }),
            transaction: jest.fn(fn => fn) // La transaction exécute directement la fonction
        });

        mockMasterDb = createMockDb();
        mockCompDb = createMockDb();

        // Mock de l'objet Tools et ses composants
        mockTools = {
            connector: {
                getSafeDatabaseName: jest.fn(name => name.toLowerCase().replace(/ /g, '_')),
                getSafeDatabasePath: jest.fn(name => name.toLowerCase().replace(/ /g, '_')),
                getDatabase: jest.fn(),
                isDatabaseExists: jest.fn()
            },
            files: {
                readAbsoluteFile: jest.fn().mockReturnValue(SCHEMA_CONTENT)
            },
            logger: {
              log: jest.fn(),
              debug: jest.fn(),
              error: jest.fn()
            }
        };

        // Par défaut, le connecteur retourne la master ou la comp selon l'appel
        mockTools.connector.getDatabase.mockImplementation((path) => {
            return path.includes('master') ? mockMasterDb : mockCompDb;
        });

        database = new Database(mockTools, SCHEMA_PATH);
    });

    test('initialize() should setup master database', () => {
        database.initialize();
        expect(mockTools.connector.getDatabase).toHaveBeenCalledWith('master');
        expect(mockMasterDb.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS competitions'));
    });

    test('listCompetitions() should return data from master database', () => {
        const mockData = [{ id: '1', name: 'Test' }];
        mockMasterDb.prepare().all.mockReturnValue(mockData);
        
        database.initialize();
        const result = database.listCompetitions();
        
        expect(mockMasterDb.prepare).toHaveBeenCalledWith('SELECT * FROM competitions');
        expect(result).toBe(mockData);
    });

    test('createCompetition() should setup new file and update master index', () => {
        database.initialize();
        mockTools.connector.isDatabaseExists.mockReturnValue(false);

        const id = database.createCompetition('Tour de France');

        // Vérifications
        expect(id).toBe('tour_de_france');
        expect(mockTools.files.readAbsoluteFile).toHaveBeenCalledWith(SCHEMA_PATH, 'utf8');
        
        // Vérifie l'initialisation du schéma sur la base comp
        expect(mockCompDb.exec).toHaveBeenCalledWith(SCHEMA_CONTENT);
        
        // Vérifie l'insertion des métadonnées locales
        expect(mockCompDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO metadata'));
        
        // Vérifie l'insertion dans l'index Master
        expect(mockMasterDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO competitions'));
    });

    test('createCompetition() should throw error if database already exists', () => {
        mockTools.connector.isDatabaseExists.mockReturnValue(true);
        expect(() => database.createCompetition('Existing')).toThrow('EXIST_ERROR');
    });

    test('syncRacers() should delete and insert racers in transaction', () => {
        mockTools.connector.isDatabaseExists.mockReturnValue(true);
        const racers = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];

        database.syncRacers('comp1', racers);

        expect(mockCompDb.transaction).toHaveBeenCalled();
        expect(mockCompDb.prepare).toHaveBeenCalledWith('DELETE FROM racers');
        expect(mockCompDb.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO racers'));
        
        // Vérifie que JSON.stringify a été utilisé pour le deuxième argument
        const runMock = mockCompDb.prepare().run;
        expect(runMock).toHaveBeenCalledWith(1, JSON.stringify(racers[0]));
        expect(runMock).toHaveBeenCalledWith(2, JSON.stringify(racers[1]));
    });

    test('syncRacers() should throw error if database does not exist', () => {
        mockTools.connector.isDatabaseExists.mockReturnValue(false);
        expect(() => database.syncRacers('unknown', [])).toThrow('NOT_EXIST_ERROR');
    });
});