
export default class Paths {

    #dbfolder
    #dirname
    #frontendbuildpath
    #fs
    #schemapath
    #path    

    constructor(path, fs, dirname, dbfolder = "../db", schemapath = "schema.sql", frontendbuildpath = "../../frontend/build") {
        this.#dbfolder          = dbfolder;
        this.#schemapath        = schemapath;
        this.#frontendbuildpath = frontendbuildpath;
        this.#dirname           = dirname;
        this.#fs                = fs;
        this.#path              = path;
    }

    get dbFolder()          {return this.#path.join(this.#dirname,this.#dbfolder);}
    get schemaPath()        {return this.#path.join(this.#dirname,this.#schemapath);}
    get frontendBuildPath() {return this.#path.join(this.#dirname,this.#frontendbuildpath);}

    initialize(){
        if (!this.#fs.existsSync(this.#dbfolder )) {
            this.#fs.mkdirSync(this.#dbfolder, { recursive: true });
        }
    }

    getSafeDatabaseName(name){
        return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
    }

    getSafeDatabasePath(name){
        return this.#path.join(this.#dbfolder, `${this.getSafeDatabaseName(name)}.db`);
    }

}
