import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Annex } from '../../../../src/database/competition/Annex.js';

describe('Annex Model Class', () => {
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
        Annex.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                type: expect.objectContaining({ 
                    type: DataTypes.ENUM('points', 'mountain', 'young', 'team'), 
                    allowNull: false 
                }),
                label: DataTypes.STRING
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'annex'
            })
        );
    });

    test('initialize() should return the initialized model instance', () => {
        const mockModel = { name: 'AnnexModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Annex.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});