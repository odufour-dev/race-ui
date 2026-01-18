import Route from "./route.js"

export default class Version extends Route {

    register(router){
        router.get('/version', (req,res) => this.#get(req,res));
    }

    #get(req,res){

        try {
            const configuration = this._connector.readConfiguration();
            const { version = "x.x.x", name = "unknown" } = JSON.parse(configuration);
            res.json({ version: version, name: name, status: 'ok' });
        } catch (e) {
            res.json({ version: "x.x.x", name: "invalid", status: 'error' });
        }
        
    }

}