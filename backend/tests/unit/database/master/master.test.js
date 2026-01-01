import { jest }                 from '@jest/globals';
import { Master, openMaster }   from '../../../../src/database/master/Master.js';

describe('Master Class', () => {
    let master;
    let mockDriver;
    let mockIndexModel;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDriver = { sync: jest.fn() };
        
        // Define mock behavior for the model methods
        mockIndexModel = {
            create: jest.fn(),
            findAll: jest.fn()
        };

        // Inject the mock model into the Master instance
        master = new Master(mockDriver, mockIndexModel);
    });

    test('registerCompetition should call Index.create with correct data', async () => {
        const name = "Champions League";
        const filename = "champions_league.db";
        const expectedData = { name, filename, status: 'active' };

        mockIndexModel.create.mockResolvedValue({ id: 1, ...expectedData });

        const result = await master.registerCompetition(name, filename);

        expect(mockIndexModel.create).toHaveBeenCalledWith(expectedData);
        expect(result.name).toBe(name);
    });

    test('getAllCompetitions should call Index.findAll', async () => {
        const mockList = [
            { name: 'Ligue 1', status: 'active' },
            { name: 'Serie A', status: 'active' }
        ];
        mockIndexModel.findAll.mockResolvedValue(mockList);

        const result = await master.getAllCompetitions();

        expect(mockIndexModel.findAll).toHaveBeenCalled();
        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Ligue 1');
    });

});