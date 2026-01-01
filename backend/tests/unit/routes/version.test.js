import { jest } from '@jest/globals';
import Version from '../../../src/routes/version.js';

describe('Version Route Class', () => {
    let versionRoute;
    let mockRouter;
    let mockConnector;
    let mockRes;

    beforeEach(() => {
        mockRouter = { get: jest.fn() };
        mockRes = { 
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis() 
        };

        mockConnector = {
            readConfiguration: jest.fn()
        };

        versionRoute = new Version(mockConnector);
        versionRoute._connector = mockConnector;
    });

    test('register() should attach GET /version to router', () => {
        versionRoute.register(mockRouter);
        expect(mockRouter.get).toHaveBeenCalledWith('/version', expect.any(Function));
    });

    test('GET /version should return configuration data on success', () => {
        const mockConfig = JSON.stringify({ version: "1.2.3", name: "my-api" });
        mockConnector.readConfiguration.mockReturnValue(mockConfig);

        versionRoute.register(mockRouter);
        const handler = mockRouter.get.mock.calls[0][1];

        handler({}, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({
            version: "1.2.3",
            name: "my-api",
            status: "ok"
        });
    });

    test('GET /version should use default values if fields are missing', () => {
        const mockConfig = JSON.stringify({}); // Valid JSON but empty
        mockConnector.readConfiguration.mockReturnValue(mockConfig);

        versionRoute.register(mockRouter);
        const handler = mockRouter.get.mock.calls[0][1];

        handler({}, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({
            version: "x.x.x",
            name: "unknown",
            status: "ok"
        });
    });

    test('GET /version should return error status if JSON parsing fails', () => {
        // Simulating a corrupted package.json
        mockConnector.readConfiguration.mockReturnValue("NOT_A_JSON");

        versionRoute.register(mockRouter);
        const handler = mockRouter.get.mock.calls[0][1];

        handler({}, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({
            version: "x.x.x",
            name: "invalid",
            status: "error"
        });
    });

    test('GET /version should return error status if readConfiguration throws', () => {
        // Simulating a file system error
        mockConnector.readConfiguration.mockImplementation(() => {
            throw new Error("File not found");
        });

        versionRoute.register(mockRouter);
        const handler = mockRouter.get.mock.calls[0][1];

        handler({}, mockRes);

        expect(mockRes.json).toHaveBeenCalledWith({
            version: "x.x.x",
            name: "invalid",
            status: "error"
        });
    });
});