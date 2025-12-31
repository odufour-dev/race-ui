import { jest }     from '@jest/globals';
import { Model }    from 'sequelize';
import Database     from '../../../src/database/database.js';

jest.spyOn(Model, 'init').mockImplementation((attributes, options) => {
  return {
    ...attributes,
    sequelize: options.sequelize,
    belongsToMany: jest.fn(),
    hasMany: jest.fn(),
    belongsTo: jest.fn(),
    create: jest.fn()
  };
});

jest.mock('../../../src/database/competition/Competition.js', () => ({
  createCompetition: jest.fn(() => ({ sync: jest.fn() }))
}));
jest.mock('../../../src/database/master/Master.js', () => ({
  openMaster: jest.fn(() => ({
    registerCompetition: jest.fn().mockResolvedValue(true),
    getAllCompetitions: jest.fn().mockReturnValue([])
  }))
}));

describe('Database Class', () => {
  let mockTools;
  let mockLogger;
  let db;

  beforeEach(() => {
    mockLogger = { log: jest.fn(), error: jest.fn() };
    mockTools = {
      connector: {
        getDatabase: jest.fn().mockReturnValue({sync: jest.fn()}),
        getSafeDatabaseName: jest.fn((name) => name.toLowerCase().replace(/ /g, '_')),
        isDatabaseExists: jest.fn(),
        readConfiguration: jest.fn(),
      }
    };
    db = new Database(mockTools, mockLogger);
  });

  test('initialize() shall configure master database and log success', async () => {
    await db.initialize();
    
    expect(mockTools.connector.getDatabase).toHaveBeenCalledWith('master');
    expect(mockLogger.log).toHaveBeenCalledWith(expect.stringContaining('initialized'));
  });

  test('createCompetition() shall create a database and register into master', async () => {
    // DB does not exist
    mockTools.connector.isDatabaseExists.mockReturnValue(false);
    
    await db.initialize(); // Initialize master database
    const result = await db.createCompetition('Tour de France');

    expect(result).toBe('tour_de_france');
    expect(mockTools.connector.getDatabase).toHaveBeenCalledWith('tour_de_france');
  });

  test('createCompetition() shall throw an error as database already exist', async () => {
    mockTools.connector.isDatabaseExists.mockReturnValue(true);
    
    await db.initialize();
    
    await expect(db.createCompetition('Existing DB'))
      .rejects.toThrow("EXIST_ERROR");
  });

  test('readConfiguration() catch JSON parsing error', () => {
    mockTools.connector.readConfiguration.mockReturnValue("invalid json");
    
    const config = db.readConfiguration();
    
    expect(config.name).toBe('invalid');
    expect(config.version).toBe('x.x.x');
  });
});