
import {createConnectorFromFolder}  from "./connector.js";
import {createExpressFromConnector} from "./express.js";
import {createFilesFromFolder}      from "./files.js";

export default class Tools {

    #connector
    #express
    #files

    constructor(rootfolder,dbfolder,logger) {
        this.#files         = createFilesFromFolder(rootfolder,logger);
        this.#connector     = createConnectorFromFolder(this.#files,dbfolder,logger);
        this.#express       = createExpressFromConnector(this.#connector,logger);
    }

    get connector() {
        return this.#connector;
    }

    get express() {
        return this.#express;
    }

    get files() {
        return this.#files;
    }    

}
