
//import { Umzug, SequelizeStorage } from 'umzug';

class Migrator {

    #files;
    #logger;
    #rootfolder;

    constructor(files, rootfolder, logger) {
        
        this.#files      = files;
        this.#logger     = logger;
        this.#rootfolder = rootfolder;

    }

    async migrate(driver) {
        /*
        const migrator = new Umzug({
            migrations: {
                glob: this.#files.jointPath(this.#rootfolder, 'migrations','*.js'),
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
            */
    }

}

export function createMigrator(file, rootfolder, logger = console) {
    return new Migrator(file, rootfolder, logger);
}
