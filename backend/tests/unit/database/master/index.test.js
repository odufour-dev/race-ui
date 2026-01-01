import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Index } from '../../../../src/database/master/Index.js';

describe('Index Model Class', () => {
    let mockSequelize;

    beforeEach(() => {
        // Mock a Sequelize instance
        mockSequelize = {
            define: jest.fn()
        };
        
        // Spy on the static init method of the parent Model class
        jest.spyOn(Model, 'init').mockImplementation(() => ({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initialize() should configure the model with correct attributes', () => {
        Index.initialize(mockSequelize);

        // Verify that Model.init was called
        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                name: expect.objectContaining({ type: DataTypes.STRING, allowNull: false }),
                filename: expect.objectContaining({ type: DataTypes.STRING, allowNull: false, unique: true }),
                date: DataTypes.DATEONLY,
                status: expect.any(Object) // Covers the ENUM type
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'competitions'
            })
        );
    });

    test('initialize() should return the initialized model', () => {
        const mockReturn = { some: 'model' };
        Model.init.mockReturnValue(mockReturn);

        const result = Index.initialize(mockSequelize);

        expect(result).toBe(mockReturn);
    });
});