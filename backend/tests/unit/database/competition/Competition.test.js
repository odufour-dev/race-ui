import { jest } from '@jest/globals';
import { Competition } from '../../../../src/database/competition/Competition.js';

describe('Competition Class', () => {
    let competition;
    let mockDriver, mockAnnex, mockAnnexResult, mockEvent, mockRace, mockRacer, mockRegistration, mockStage, mockStageResult;

    beforeEach(() => {
        // Create mock models with association methods
        const createMockModel = () => ({
            belongsToMany: jest.fn(),
            hasMany: jest.fn(),
            belongsTo: jest.fn()
        });

        mockDriver = {}; // Driver isn't used in initialize methods logic
        mockAnnex           = createMockModel();
        mockAnnexResult     = createMockModel();
        mockEvent           = createMockModel();
        mockRace            = createMockModel();
        mockRacer           = createMockModel();
        mockRegistration    = createMockModel();
        mockStage           = createMockModel();
        mockStageResult     = createMockModel();

        competition = new Competition(
            mockDriver,
            mockAnnex,
            mockAnnexResult,
            mockEvent,
            mockRace,
            mockRacer,
            mockRegistration,
            mockStage,
            mockStageResult
        );
    });

    test('Getters should return the injected models', () => {
        expect(competition.Annex).toBe(mockAnnex);
        expect(competition.AnnexResult).toBe(mockAnnexResult);
        expect(competition.Event).toBe(mockEvent);
        expect(competition.Race).toBe(mockRace);
        expect(competition.Racer).toBe(mockRacer);
        expect(competition.Registration).toBe(mockRegistration);
        expect(competition.Stage).toBe(mockStage);
        expect(competition.StageResult).toBe(mockStageResult);
    });

    test('initialize() should set up all Sequelize associations', () => {
        competition.initialize();

        // Check Many-to-Many Race <-> Racer
        expect(mockRace.belongsToMany).toHaveBeenCalledWith(mockRacer, expect.objectContaining({
            through: mockRegistration,
            as: 'racers'
        }));
        expect(mockRacer.belongsToMany).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            through: mockRegistration,
            as: 'races'
        }));

        // Check Race -> Stage
        expect(mockRace.hasMany).toHaveBeenCalledWith(mockStage, expect.objectContaining({
            as: 'stages',
            onDelete: 'CASCADE'
        }));
        expect(mockStage.belongsTo).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            as: 'race'
        }));

        // Check Race -> Annex
        expect(mockRace.hasMany).toHaveBeenCalledWith(mockAnnex, expect.objectContaining({
            as: 'annexes'
        }));
        expect(mockAnnex.belongsTo).toHaveBeenCalledWith(mockRace, expect.objectContaining({
            as: 'race'
        }));
    });
});