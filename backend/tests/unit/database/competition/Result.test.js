import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Result } from '../../../../src/database/competition/Result.js';

describe('Result Model Class', () => {
    let mockSequelize;

    beforeEach(() => {
        mockSequelize = {};
        jest.spyOn(Model, 'init').mockImplementation(() => ({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initialize() should configure the model correctly', () => {
        Result.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                rank: expect.objectContaining({ type: expect.any(Function), allowNull: true }),
                time: expect.objectContaining({ type: expect.any(Function), allowNull: true }),
                points: expect.objectContaining({ type: expect.any(Function), defaultValue: 0 })
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'result',
                tableName: 'result'
            })
        );
    });

    test('initialize() should return the model instance', () => {
        const mockModel = { name: 'ResultModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Result.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});