import { jest } from '@jest/globals';

const mockDatabase = jest.fn().mockImplementation(() => {
    return {
        prepare: jest.fn(),
        close: jest.fn(),
        exec: jest.fn()
    };
});

export default mockDatabase;