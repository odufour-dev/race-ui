import { jest } from '@jest/globals';
import createConnector from '../../../src/database/connector.js';

// 1. Mock the file system and logger
const mockFiles = {
    basename: jest.fn((name) => name),
    exists: jest.fn(),
    joinPath: jest.fn((...args) => args.join('/')),
    // Important: readConfiguration expects a string/buffer
    readFile: jest.fn(() => JSON.stringify({ version: "1.0.0" }))
};

const mockLogger = {
    log: jest.fn(),
    error: jest.fn()
};

describe('Connector Class Integration Test', () => {
    let connector;
    // Use ':memory:' as the root folder so Sequelize creates in-memory DBs
    const rootFolder = ':memory:'; 
    const masterName = 'master';

    beforeEach(async () => {
        jest.clearAllMocks();
        // The real Sequelize will be used, but since the path contains ':memory:', 
        // it won't write to disk.
        connector = await createConnector(mockFiles, rootFolder, masterName, mockLogger);
    });

    afterEach(async () => {
        await connector.closeAll();
    });

    test('should initialize the Master database correctly', async () => {
        expect(connector.master).toBeDefined();
        // Check if the logger was called during initialization
        expect(mockLogger.log).toHaveBeenCalledWith(
            expect.stringContaining('Master database initialized')
        );
    });

    test('should sanitize database names correctly', () => {
        const dirtyName = "User/Data..01!";
        const cleanName = connector.getSafeDatabaseName(dirtyName);
        expect(cleanName).toBe('user_data__01_');
    });

    test('should create and cache a new database connection', async () => {
        const dbName = 'league_2024';
        const db = await connector.getDatabase(dbName);

        // Ensure it's a valid Sequelize instance
        expect(db.constructor.name).toBe('Sequelize');
        expect(connector.isDatabaseExists('league_2024')).toBe(true);

        // Ensure the singleton pattern works (returns the same instance)
        const cachedDb = await connector.getDatabase(dbName);
        expect(db).toBe(cachedDb);
    });

    test('should close a specific database', async () => {

        mockFiles.exists.mockReturnValue(false);
        
        await connector.getDatabase('temp_db');
        expect(connector.isDatabaseExists('temp_db')).toBe(true);

        const closed = await connector.closeDatabase('temp_db');
        expect(closed).toBe(true);
        expect(connector.isDatabaseExists('temp_db')).toBe(false);
    });

    test('should close all connections', async () => {
        
        mockFiles.exists.mockReturnValue(false);

        await connector.getDatabase('db_1');
        await connector.getDatabase('db_2');

        await connector.closeAll();
        expect(connector.isDatabaseExists('db_1')).toBe(false);
        expect(connector.isDatabaseExists('db_2')).toBe(false);
    });

    test('should read configuration from package.json', () => {
        const config = connector.readConfiguration();
        expect(mockFiles.readFile).toHaveBeenCalled();
        expect(config).toContain('{"version":"1.0.0"}');
    });

    test('should throw an error and log it if initialization fails', async () => {
        // We simulate a failure by passing invalid arguments to a new instance
        const badFiles = { ...mockFiles, joinPath: () => { throw new Error("FS Error"); } };
        const failingConnector = new (connector.constructor)(badFiles, rootFolder, {}, mockLogger);

        await expect(failingConnector.initialize('fail'))
            .rejects.toThrow("FS Error");
        expect(mockLogger.error).toHaveBeenCalled();
    });
});