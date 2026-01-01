import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Racer } from '../../../../src/database/competition/Racer.js';

describe('Racer Model Class', () => {
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
        Racer.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                // Match the simple function types as defined in your class
                firstName: DataTypes.STRING,
                lastName: DataTypes.STRING,
                team: DataTypes.STRING,
                category: DataTypes.STRING,
                ffcID: DataTypes.STRING,
                uciID: DataTypes.STRING,
                // Sex is an object because ENUM always returns an object structure
                sex: expect.objectContaining({ 
                    values: ["men", "women"] 
                })
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'racer'
            })
        );
    });

    test('initialize() should return the initialized model', () => {
        const mockModel = { name: 'RacerModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Racer.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});