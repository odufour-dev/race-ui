import { jest } from '@jest/globals';
import { Model, DataTypes } from 'sequelize';
import { Registration } from '../../../../src/database/competition/Registration.js';

describe('Registration Model Class', () => {
    let mockSequelize;

    beforeEach(() => {
        mockSequelize = {};
        jest.spyOn(Model, 'init').mockImplementation(() => ({}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initialize() should configure the model with the bib attribute', () => {
        Registration.initialize(mockSequelize);

        expect(Model.init).toHaveBeenCalledWith(
            expect.objectContaining({
                bib: expect.objectContaining({ 
                    type: expect.any(Function), 
                    allowNull: true 
                })
            }),
            expect.objectContaining({
                sequelize: mockSequelize,
                modelName: 'registration'
            })
        );
    });

    test('initialize() should return the model instance', () => {
        const mockModel = { name: 'RegistrationModel' };
        Model.init.mockReturnValue(mockModel);

        const result = Registration.initialize(mockSequelize);

        expect(result).toBe(mockModel);
    });
});