
import {createExpress}          from "./express.js";
import {createFilesFromFolder}  from "./files.js";

export default class Tools {

    #express
    #files
    #logger

    constructor(logger) {
        this.#files         = createFilesFromFolder(logger);
        this.#express       = createExpress(logger);
        this.#logger        = logger;
    }

    get express()   {return this.#express;  }
    get files()     {return this.#files;    }
    get logger()    {return this.#logger;    }

}
