import { jest } from '@jest/globals';
import Competition from '../../../src/routes/competition.js';

describe('Competition Route Class', () => {
    let competitionRoute;
    let mockRouter;
    let mockConnector;
    let mockRes;
    let mockModels;

    beforeEach(() => {
        mockRouter = { get: jest.fn(), post: jest.fn() };
        mockRes = { 
            status: jest.fn().mockReturnThis(), 
            json: jest.fn().mockReturnThis() 
        };

        mockModels = {race: {create: jest.fn()}};
        
        mockConnector = {
            getSafeDatabaseName: jest.fn(name => name.toLowerCase()),
            isDatabaseExists: jest.fn(),
            getDatabase: jest.fn().mockReturnValue({
                models: mockModels 
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
        mockModels.race.create.mockResolvedValue({id: 1});
        
        // DO NOT use mockResolvedValue on getDatabase here.
        // The beforeEach already set it up correctly as a sync call.

        competitionRoute.register(mockRouter);
        const postHandler = mockRouter.post.mock.calls[0][1];

        await postHandler(req, mockRes);

        expect(mockConnector.getDatabase).toHaveBeenCalledWith('world cup','World Cup');
        expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    test('POST /competitions should return 500 on server error', async () => {
        const req = { body: { name: 'Error' } };
        mockConnector.isDatabaseExists.mockReturnValue(false);
        mockConnector.getDatabase.mockRejectedValue(new Error('DB Fail'));
        
        competitionRoute.register(mockRouter);
        const postHandler = mockRouter.post.mock.calls[0][1];

        await postHandler(req, mockRes);

        // This will now trigger your "Error caught!" console log
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ error: "DB Fail" });
    });
});