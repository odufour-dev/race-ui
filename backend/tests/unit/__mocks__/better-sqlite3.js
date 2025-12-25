import { jest } from '@jest/globals';

const mockDatabase = jest.fn().mockImplementation(() => {
    return {
        // Ajout de la méthode transaction
        // Elle prend une fonction 'fn' et l'exécute immédiatement
        transaction: jest.fn((fn) => {
            return (...args) => fn(...args);
        }),
        prepare: jest.fn().mockReturnValue({
            run: jest.fn(),
            all: jest.fn().mockReturnValue([]),
            get: jest.fn()
        }),
        close: jest.fn(),
        exec: jest.fn()
    };
});

export default mockDatabase;