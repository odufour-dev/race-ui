
export default class Route {

    _database
    _logger

    constructor(database,logger){
        this._database = database;
        this._logger   = logger;
        if (new.target === Route) {
            throw new Error("Abstract class");
        }
    }

    register() {
        throw new Error("register method shall be implemented");
    }

}