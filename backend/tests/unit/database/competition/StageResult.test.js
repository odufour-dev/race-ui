import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { StageResult } from '../../../../src/database/competition/StageResult.js';

describe('StageResult Model Class', () => {
    let mockSequelize;

    beforeEach(() => {
        mockSequelize = {};
        jest.spyOn(Model, 'init').mockImplementation(() => ({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initialize() should configure the model correctly', () => {
        StageResult.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                rank:   expect.objectContaining({ type: expect.any(Function), allowNull: false }),
                bib:    expect.objectContaining({ type: expect.any(Function), allowNull: false }),
                stage:  expect.objectContaining({ type: expect.any(Function), allowNull: false }),
                status: expect.objectContaining({ defaultValue: 'unknown' }),
                time:   expect.objectContaining({ type: expect.any(Function), defaultValue: 0 }),
                millis: expect.objectContaining({ type: expect.any(Function), defaultValue: 0 })
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'stageresult',
                tableName: 'stageresult'
            })
        );
    });

    test('initialize() should return the model instance', () => {
        const mockModel = { name: 'ResultModel' };
        Model.init.mockReturnValue(mockModel);

        const result = StageResult.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});