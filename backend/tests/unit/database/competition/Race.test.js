import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Race } from '../../../../src/database/competition/Race.js';

describe('Race Model Class', () => {
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
        Race.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                // Direct reference matching for simple assignments
                name: DataTypes.STRING,
                nStages: DataTypes.INTEGER
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'race'
            })
        );
    });

    test('initialize() should return the model instance', () => {
        const mockModel = { name: 'RaceModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Race.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});