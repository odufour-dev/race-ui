import Route from "./route.js"

export class Version extends Route {

    register(router){
        router.get('/version', (req,res) => this.#get(req,res));
    }

    #get(req,res){
        const configuration = this._database.readConfiguration();
        res.json({ ...configuration, status: 'ok' });
    }

}