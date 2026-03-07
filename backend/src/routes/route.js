
export default class Route {

    _connector
    _processor
    _logger
    _time

    constructor(connector,processor,time,logger){
        this._connector = connector;
        this._processor = processor;
        this._logger    = logger;
        this._time      = time;
        if (new.target === Route) {
            throw new Error("Abstract class");
        }
    }

    register() {
        throw new Error("register method shall be implemented");
    }

}