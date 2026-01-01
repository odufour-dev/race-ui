
export default class Static {

    #filepaths
    #logger
    #tools

    constructor(tools,filepaths,logger=console){
        this.#filepaths = filepaths;
        this.#logger    = logger;
        this.#tools     = tools;
    }

    register(){
        this.#tools.express.registerStatic(this.#filepaths,(req,res) => this.sendFile(req,res));
    }

    sendFile(req,res){
        const indexPath = this.#tools.files.joinPath(this.#filepaths, 'index.html');
        this.#tools.files.exists(indexPath) ? res.sendFile(indexPath) : res.status(404).send("Build missing");
    }
    
}
