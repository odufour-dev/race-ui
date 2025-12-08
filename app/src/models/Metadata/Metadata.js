
class MetadataElement {
    #filename
    #text
    constructor(filename){
        this.#filename = filename;
    }
    get text(){return this.#text ?? "";}

    async load() {
        const response = await fetch(this.#filename);
        if (response.ok) {
            this.#text = (await response.text()).trim();
        } else {
            this.#text = "";
        }
    }

}

export class Metadata {

    #commit
    #name
    #version

    constructor(commit = new MetadataElement("/metadata/commit.txt"), name = new MetadataElement("/metadata/name.txt"), version =new MetadataElement("./metadata/VERSION.txt")){
        this.#commit    = commit;
        this.#name      = name;
        this.#version   = version;
    }

    get commit()    {return this.#commit.text;   }
    get name()      {return this.#name.text;     }
    get version()   {return this.#version.text;  }

    get fullName() {
        return [this.name, this.version, this.commit].filter(Boolean).join(" - ");
    }

    async initialize(){
        await Promise.all([
            this.#commit.load(),
            this.#name.load(),
            this.#version.load(),
        ]);
    }

}



