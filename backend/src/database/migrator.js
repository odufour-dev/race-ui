
import { Umzug, SequelizeStorage } from 'umzug';

class Migrator {

    #filelocation;
    #logger;

    constructor(filelocation, logger) {
        
        this.#filelocation  = filelocation;
        this.#logger        = logger;

    }

    async migrate(driver) {
        
        const migrator = new Umzug({
            migrations: {
                glob: this.#filelocation + '/*.js',
                resolve: ({ name, path: filepath, context }) => ({
                    name,
                    up: async () => {
                        const migration = await import(`file://${filepath}`);
                        return migration.up({ context });
                    },
                    down: async () => {
                        const migration = await import(`file://${filepath}`);
                        return migration.down({ context });
                    },
                }),
            },
            context: driver.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize: driver }),
            logger: this.#logger,
        });

        try {
            await migrator.up();
            this.#logger.info("Database migrated successfully.");
        } catch (error) {
            this.#logger.error("Error during database migration:", error);
            throw error;
        }
    
    }

}

export default function createMigrator(filelocation, logger = console) {
    return new Migrator(filelocation, logger);
}
