
import {createConnector}    from "./connector.js";
import {createExpress}      from "./express.js";
import {createFilesFromURL} from "./files.js";

export default class Tools {

    #connector
    #express
    #files

    constructor(url) {
        this.#files         = createFilesFromURL(url);
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
