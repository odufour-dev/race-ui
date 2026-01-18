import { jest } from '@jest/globals';
import Route from '../../../src/routes/route.js';

describe('Route Abstract Class', () => {
    const mockConnector = { name: 'mockConnector' };
    const mockLogger = { log: jest.fn() };

    test('should throw error when instantiated directly', () => {
        expect(() => {
            new Route(mockConnector, mockLogger);
        }).toThrow("Abstract class");
    });

    test('should store connector and logger when extended', () => {
        // Create a dummy subclass to test instantiation
        class SubRoute extends Route {}
        
        const instance = new SubRoute(mockConnector, mockLogger);
        
        expect(instance._connector).toBe(mockConnector);
        expect(instance._logger).toBe(mockLogger);
    });

    test('register() should throw error if not overridden', () => {
        class SubRoute extends Route {}
        const instance = new SubRoute(mockConnector, mockLogger);
        
        expect(() => {
            instance.register();
        }).toThrow("register method shall be implemented");
    });

    test('should not throw error when a valid subclass is instantiated', () => {
        class ValidRoute extends Route {
            register(router) { return true; }
        }
        
        const instance = new ValidRoute(mockConnector, mockLogger);
        expect(instance).toBeInstanceOf(Route);
        expect(instance.register()).toBe(true);
    });
});