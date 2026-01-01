import { jest } from '@jest/globals';

jest.unstable_mockModule('../../../src/tools/connector.js', () => ({
    createConnectorFromFolder: jest.fn(() => ({ name: 'mocked_connector' }))
}));
jest.unstable_mockModule('../../../src/tools/express.js', () => ({
    createExpressFromConnector: jest.fn(() => ({ name: 'mocked_express' }))
}));
jest.unstable_mockModule('../../../src/tools/files.js', () => ({
    createFilesFromFolder: jest.fn(() => ({ name: 'mocked_files' }))
}));

const { default: Tools }             = await import('../../../src/tools/tools.js');
const { createConnectorFromFolder }  = await import('../../../src/tools/connector.js');
const { createExpressFromConnector } = await import('../../../src/tools/express.js');
const { createFilesFromFolder }      = await import('../../../src/tools/files.js');

describe('Tools Class', () => {

    const DB = '/db';
    const LOGGER = { log: jest.fn() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should initialize all components with correct dependencies', () => {

        // [ EXERCISE ]
        const tools = new Tools(DB, LOGGER);

        // [ VERIFY ]
        expect(createFilesFromFolder).toHaveBeenCalledWith(LOGGER);

        const filesInstance = tools.files;
        expect(createConnectorFromFolder).toHaveBeenCalledWith(filesInstance, DB, LOGGER);

        const connectorInstance = tools.connector;
        expect(createExpressFromConnector).toHaveBeenCalledWith(connectorInstance, LOGGER);
    });

    test('getters should return the correct instances', () => {
        const tools = new Tools(DB, LOGGER);

        expect(tools.files).toEqual({ name: 'mocked_files' });
        expect(tools.connector).toEqual({ name: 'mocked_connector' });
        expect(tools.express).toEqual({ name: 'mocked_express' });
    });
});