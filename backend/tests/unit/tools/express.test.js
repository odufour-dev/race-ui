import { jest } from '@jest/globals';

import { Express } from '../../../src/tools/express.js';

describe('Express Class (Unit Tests)', () => {

    let mockProcess;
    let mockConnector;
    let mockServer;
    let mockLogger;
    let expressInstance;

    beforeEach(() => {
        
        mockProcess = {
            on: jest.fn(),
            exit: jest.fn()
        };

        mockConnector = {
            closeAll: jest.fn()
        };

        mockServer = {
            close: jest.fn((callback) => callback())
        };

        mockLogger = {
            log:    jest.fn(),
            debug:  jest.fn(),
            error:  jest.fn()
        };

        expressInstance = new Express(mockProcess, mockConnector, mockLogger);
    });

    test('listen() shall register closing methods', () => {
        
        // [ SETUP ]
        jest.spyOn(expressInstance.instance, 'listen').mockReturnValue(mockServer);

        // [ EXERCISE ]
        expressInstance.listen(3000);

        // [ VERIFY ]
        expect(mockProcess.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
        expect(mockProcess.on).toHaveBeenCalledWith('SIGINT', expect.any(Function));

    });

    test('shutdown() shall close server than connector', () => {
        
        // [ EXERCISE ]
        expressInstance.shutdown(mockServer, 'SIGINT');

        // [ VERIFY ]
        // 1. HTTP server is closed
        expect(mockServer.close).toHaveBeenCalled();

        // 2. All database are closed
        expect(mockConnector.closeAll).toHaveBeenCalled();

        // 3. Clean process exit (code 0)
        expect(mockProcess.exit).toHaveBeenCalledWith(0);

    });

    test('shutdown() shall force exit after tmeout', () => {
        
        // [ SETUP ]
        const stallingServer = {
            close: jest.fn() 
        };
        jest.useFakeTimers();

        // [ EXERCISE ]
        expressInstance.shutdown(stallingServer, 'SIGTERM');
        jest.advanceTimersByTime(11000); // 11 seconds

        //[ VERIFY ] (code 1)
        expect(mockProcess.exit).toHaveBeenCalledWith(1);

        // [ TEARDOWN ]
        jest.useRealTimers();

    });

});