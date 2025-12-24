
import {createConnector}    from "./connector.js";
import {createExpress}      from "./express.js";
import {createFilesFromFolder} from "./files.js";

export default class Tools {

    #connector
    #express
    #files

    constructor(rootfolder) {
        this.#files         = createFilesFromFolder(rootfolder);
        this.#express       = createExpress();
        this.#connector     = createConnector(this.#files);
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
