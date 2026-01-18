
export default class Static {

    #filepaths
    #files
    #logger

    constructor(files,filepaths,logger=console){
        this.#filepaths = filepaths;
        this.#files     = files;
        this.#logger    = logger;
    }

    register(server){
        server.registerStatic(this.#filepaths,(req,res) => this.sendFile(req,res));
    }

    sendFile(req,res){
        const indexPath = this.#files.joinPath(this.#filepaths, 'index.html');
        this.#files.exists(indexPath) ? res.sendFile(indexPath) : res.status(404).send("Build missing");
    }
    
}
