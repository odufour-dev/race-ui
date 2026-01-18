import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Stage } from '../../../../src/database/competition/Stage.js';

describe('Stage Model Class', () => {
    let mockSequelize;

    beforeEach(() => {
        mockSequelize = {};
        // Spy on the parent Model.init method
        jest.spyOn(Model, 'init').mockImplementation(() => ({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initialize() should configure the model with correct attributes', () => {
        Stage.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.any(Function), // Or DataTypes.STRING
                number: expect.any(Function),
                date: expect.any(Function),
                startLocation: expect.any(Function),
                endLocation: expect.any(Function),
                distance: expect.any(Function),
                type: expect.objectContaining({ 
                    // We keep this specific to check the ENUM values
                    values: ["flat", "hilly", "mountain", "time-trial"]
                })
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'stage'
            })
        );
    });

    test('initialize() should return the model instance', () => {
        const mockModel = { name: 'StageModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Stage.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});