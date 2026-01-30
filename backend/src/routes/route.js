
export default class Route {

    _connector
    _processor
    _logger

    constructor(connector,processor,logger){
        this._connector = connector;
        this._processor = processor;
        this._logger    = logger;
        if (new.target === Route) {
            throw new Error("Abstract class");
        }
    }

    register() {
        throw new Error("register method shall be implemented");
    }

}