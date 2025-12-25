import fs                   from 'fs';
import path                 from 'path';

export class Files {

    #fs
    #logger
    #path    
    #rootfolder

    constructor(path, fs, rootfolder,logger) {
        this.#rootfolder        = rootfolder;
        this.#fs                = fs;
        this.#path              = path;
        this.#logger            = logger;
    }

    get rootfolder(){return this.#rootfolder;}

    exists(filePath) {
        return this.#fs.existsSync(filePath);        
    }

    joinAbsolutePath(...segments) {
        return this.#path.join(this.#rootfolder, ...segments);
    }

    joinPath(...segments) {
        return this.#path.join(...segments);
    }

    mkdir(dirPath, options={ recursive: true }) {
        this.#fs.mkdirSync(dirPath, options);
    }

    readAbsoluteDir(dirPath) {
        dirPath = this.#path.join(this.#rootfolder,dirPath)
        return this.#fs.readdirSync(dirPath);
    }

    readDir(dirPath) {
        return this.#fs.readdirSync(dirPath);
    }

    readAbsoluteFile(filePath, encoding='utf8') {
        filePath = this.#path.join(this.#rootfolder,filePath);
        return this.#fs.readFileSync(filePath, encoding);
    }

    readFile(filePath, encoding='utf8') {
        return this.#fs.readFileSync(filePath, encoding);
    }

    writeFile(filePath, data, encoding='utf8') {
        this.#fs.writeFileSync(filePath, data, encoding);
    }

}

export function createFilesFromFolder(rootfolder,logger=console){
    return new Files(path,fs,rootfolder,logger);
}
