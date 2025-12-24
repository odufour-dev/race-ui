
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

    #branch
    #commit
    #date
    #name
    #version

    constructor(
        branch  = new MetadataElement("/metadata/branch.txt"),
        commit  = new MetadataElement("/metadata/commit.txt"),
        date    = new MetadataElement("/metadata/date.txt"), 
        name    = new MetadataElement("/metadata/name.txt"), 
        version = new MetadataElement("./metadata/VERSION.txt")
    ){
        this.#branch    = branch;
        this.#commit    = commit;
        this.#date      = date;
        this.#name      = name;
        this.#version   = version;
    }

    get branch()    {return this.#branch.text;   }
    get commit()    {return this.#commit.text;   }
    get date()      {return this.#date.text;     }
    get name()      {return this.#name.text;     }
    get version()   {return this.#version.text;  }

    get fullName() {
        return [this.name, this.version, this.date, this.branch, this.commit].filter(Boolean).join(" - ");
    }

    async initialize(){
        await Promise.all([
            this.#branch.load(),
            this.#commit.load(),
            this.#date.load(),
            this.#name.load(),
            this.#version.load(),
        ]);
    }

}



