import fs                   from 'fs';
import path                 from 'path';

export class Files {

    #fs
    #logger
    #path

    constructor(path, fs, logger = console) {
        this.#fs                = fs;
        this.#path              = path;
        this.#logger            = logger;
    }

    basename(filename){
        return this.#path.parse(filename).name;
    }

    exists(filePath) {
        return this.#fs.existsSync(filePath);        
    }

    joinPath(...segments) {
        return this.#path.join(...segments);
    }

    mkdir(dirPath, options={ recursive: true }) {
        this.#fs.mkdirSync(dirPath, options);
    }

    readDir(dirPath) {
        return this.#fs.readdirSync(dirPath);
    }

    readFile(filePath, encoding='utf8') {
        try {
            return this.#fs.readFileSync(filePath, encoding);
        } catch (e) {
            throw Error("FILE_NOT_FOUND : " + e.message);
        }
    }

    writeFile(filePath, data, encoding='utf8') {
        this.#fs.writeFileSync(filePath, data, encoding);
    }

}

export default function createFiles(logger=console){
    return new Files(path,fs,logger);
}
