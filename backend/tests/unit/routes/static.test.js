import { jest } from '@jest/globals';
import Static from '../../../src/routes/static.js';

describe('Static Route Class', () => {
    let staticRoute;
    let mockFiles;
    let mockServer;
    let mockRes;
    let mockReq;
    const mockPath = '/dist';

    beforeEach(() => {
        mockFiles = {
            joinPath: jest.fn((...args) => args.join('/')),
            exists: jest.fn()
        };
        mockServer = {
            registerStatic: jest.fn()
        };
        mockRes = {
            sendFile: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn().mockReturnThis()
        };
        mockReq = {};

        staticRoute = new Static(mockFiles, mockPath);
    });

    test('register() should call server.registerStatic with correct arguments', () => {
        staticRoute.register(mockServer);
        
        expect(mockServer.registerStatic).toHaveBeenCalledWith(
            mockPath, 
            expect.any(Function)
        );
    });

    test('sendFile() should send index.html if it exists', () => {
        // Setup: File exists
        mockFiles.exists.mockReturnValue(true);

        staticRoute.sendFile(mockReq, mockRes);

        const expectedPath = '/dist/index.html';
        expect(mockFiles.joinPath).toHaveBeenCalledWith(mockPath, 'index.html');
        expect(mockFiles.exists).toHaveBeenCalledWith(expectedPath);
        expect(mockRes.sendFile).toHaveBeenCalledWith(expectedPath);
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('sendFile() should return 404 if index.html is missing', () => {
        // Setup: File does NOT exist
        mockFiles.exists.mockReturnValue(false);

        staticRoute.sendFile(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith("Build missing");
        expect(mockRes.sendFile).not.toHaveBeenCalled();
    });
});