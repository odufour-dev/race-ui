import { jest } from '@jest/globals';

import { Connector } from '../../../src/tools/connector';
import Database from 'better-sqlite3';

describe('Connector Class', () => {

    let mockFiles;
    let mockLogger;
    let connector;
    const rootFolder = '/data';

    beforeEach(() => {

        Database.mockClear();

        // Mock files object
        mockFiles = {
            getSafeDatabaseName: jest.fn(name => name),
            joinAbsolutePath: jest.fn((root, name) => `${root}/${name}`),
            exists: jest.fn()
        };

        mockLogger = {
            log:    jest.fn(),
            debug:  jest.fn(),
            error:  jest.fn()
        };

        connector = new Connector(mockFiles, rootFolder,mockLogger);
    });

    test('getDatabase shall create a new competition', () => {
        
        // [ SETUP ]
        const dbName = 'competition_1';
        
        // [ EXERCISE ]
        // 1st call
        const db1 = connector.getDatabase(dbName);
        
        // 2nd call with the same name
        const db2 = connector.getDatabase(dbName);

        // [ VERIFY ]
        // Database shall be created only once
        expect(Database).toHaveBeenCalledTimes(1); 
        // db1 and db2 shall be the same instance
        expect(db1).toBe(db2);

    });

    test('closeAll shall close all opened connections', () => {
        
        // [ SETUP ]
        const db1 = connector.getDatabase('comp_A');
        const db2 = connector.getDatabase('comp_B');

        // [ EXERCISE ]
        connector.closeAll();

        // [ VERIFY ]
        expect(db1.close).toHaveBeenCalledTimes(1);
        expect(db2.close).toHaveBeenCalledTimes(1);

    });

    test('closeDatabase shall close and delete a dedicated database', () => {

        // [ SETUP ]
        const name = 'comp_to_close';
        const db = connector.getDatabase(name);

        // [ EXERCISE ]
        const result = connector.closeDatabase(name);

        // [ VERIFY ]
        expect(result).toBe(true);
        expect(db.close).toHaveBeenCalledTimes(1);
        
        // Re-created if asked again
        connector.getDatabase(name);
        expect(Database).toHaveBeenCalledTimes(2); 

    });

});