
import {createConnectorFromFolder}  from "./connector.js";
import {createExpressFromConnector} from "./express.js";
import {createFilesFromFolder}      from "./files.js";

export default class Tools {

    #connector
    #express
    #files
    #logger

    constructor(dbfolder,logger) {
        this.#files         = createFilesFromFolder(logger);
        this.#connector     = createConnectorFromFolder(this.#files,dbfolder,logger);
        this.#express       = createExpressFromConnector(this.#connector,logger);
        this.#logger        = logger;
    }

    get connector() {return this.#connector;}
    get express()   {return this.#express;  }
    get files()     {return this.#files;    }
    get logger()    {return this.#logger;    }

}
