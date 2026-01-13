import { jest } from '@jest/globals';
import { Competition } from '../../../../src/database/competition/Competition.js';

describe('Competition Class', () => {
    let competition;
    let mockDriver, mockAnnex, mockEvent, mockRace, mockRacer, mockRegistration, mockResult, mockStage;

    beforeEach(() => {
        // Create mock models with association methods
        const createMockModel = () => ({
            belongsToMany: jest.fn(),
            hasMany: jest.fn(),
            belongsTo: jest.fn()
        });

        mockDriver = {}; // Driver isn't used in initialize methods logic
        mockAnnex           = createMockModel();
        mockEvent           = createMockModel();
        mockRace            = createMockModel();
        mockRacer           = createMockModel();
        mockRegistration    = createMockModel();
        mockResult          = createMockModel();
        mockStage           = createMockModel();

        competition = new Competition(
            mockDriver,
            mockAnnex,
            mockEvent,
            mockRace,
            mockRacer,
            mockRegistration,
            mockResult,
            mockStage
        );
    });

    test('Getters should return the injected models', () => {
        expect(competition.Annex).toBe(mockAnnex);
        expect(competition.Event).toBe(mockEvent);
        expect(competition.Race).toBe(mockRace);
        expect(competition.Racer).toBe(mockRacer);
        expect(competition.Registration).toBe(mockRegistration);
        expect(competition.Results).toBe(mockResult);
        expect(competition.Stage).toBe(mockStage);
    });

    test('initialize() should set up all Sequelize associations', () => {
        competition.initialize();

        // Check Many-to-Many Race <-> Racer
        expect(mockRace.belongsToMany).toHaveBeenCalledWith(mockRacer, expect.objectContaining({
            through: mockRegistration,
            as: 'Racers'
        }));
        expect(mockRacer.belongsToMany).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            through: mockRegistration,
            as: 'races'
        }));

        // Check Race -> Stage
        expect(mockRace.hasMany).toHaveBeenCalledWith(mockStage, expect.objectContaining({
            as: 'Stages',
            onDelete: 'CASCADE'
        }));
        expect(mockStage.belongsTo).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            as: 'race'
        }));

        // Check Stage -> Result
        expect(mockStage.hasMany).toHaveBeenCalledWith(mockResult, expect.objectContaining({
            as: 'Results'
        }));
        expect(mockResult.belongsTo).toHaveBeenCalledWith(mockStage, expect.objectContaining({
            as: 'stage'
        }));

        // Check Racer -> Result
        expect(mockRacer.hasMany).toHaveBeenCalledWith(mockResult, expect.objectContaining({
            as: 'Results'
        }));
        expect(mockResult.belongsTo).toHaveBeenCalledWith(mockRacer, expect.objectContaining({
            as: 'racer'
        }));

        // Check Race -> Annex
        expect(mockRace.hasMany).toHaveBeenCalledWith(mockAnnex, expect.objectContaining({
            as: 'Annexes'
        }));
        expect(mockAnnex.belongsTo).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            as: 'race'
        }));
    });
});