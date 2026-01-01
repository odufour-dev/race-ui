import { jest } from '@jest/globals';
import Competition from '../../../src/routes/competition.js';

describe('Competition Route Class', () => {
    let competitionRoute;
    let mockRouter;
    let mockConnector;
    let mockRes;
    let mockSync; // Move this out to access it in tests

    beforeEach(() => {
        mockRouter = { get: jest.fn(), post: jest.fn() };
        mockRes = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis() 
        };

        mockSync = jest.fn().mockResolvedValue([]);
        
        mockConnector = {
            getSafeDatabaseName: jest.fn(name => name.toLowerCase()),
            isDatabaseExists: jest.fn(),
            getDatabase: jest.fn().mockReturnValue({
                sync: mockSync 
            }),
            DATABASE_EXTENSION: '.db',
            competitions: { create: jest.fn() },
            master: {
                getAllCompetitions: jest.fn(),
                registerCompetition: jest.fn().mockResolvedValue([])
            }
        };

        competitionRoute = new Competition(mockConnector);
        // Ensure the internal _connector is set (if your base class uses this property)
        competitionRoute._connector = mockConnector; 
    });

    test('POST /competitions should create a new competition', async () => {
        const req = { body: { name: 'World Cup' } };
        mockConnector.isDatabaseExists.mockReturnValue(false);
        
        // DO NOT use mockResolvedValue on getDatabase here.
        // The beforeEach already set it up correctly as a sync call.

        competitionRoute.register(mockRouter);
        const postHandler = mockRouter.post.mock.calls[0][1];

        await postHandler(req, mockRes);

        expect(mockConnector.getDatabase).toHaveBeenCalledWith('world cup');
        expect(mockSync).toHaveBeenCalled(); // Use the mockSync defined in beforeEach
        expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('POST /competitions should return 500 on server error', async () => {
        const req = { body: { name: 'Error' } };
        mockConnector.isDatabaseExists.mockReturnValue(false);
        
        // Force the sync (which is awaited) to fail
        mockSync.mockRejectedValue(new Error('DB Fail'));

        competitionRoute.register(mockRouter);
        const postHandler = mockRouter.post.mock.calls[0][1];

        await postHandler(req, mockRes);

        // This will now trigger your "Error caught!" console log
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "INTERNAL_ERROR" });
    });
});