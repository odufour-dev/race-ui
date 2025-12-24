import cors    from 'cors';
import express from 'express';

export class Express {

    #app

    constructor() {
        this.#app = express();
        this.#app.use(cors());
        this.#app.use(express.json());
    }

    get router() {
        return express.Router();
    }

    listen(port){

        // DEBUG : List the registered routes
        this.#app._router.stack.forEach((middleware) => {
        if (middleware.route) { // Routes enregistrées directement sur l'app
            console.log(`${Object.keys(middleware.route.methods).join(', ').toUpperCase()} ${middleware.route.path}`);
        } else if (middleware.name === 'router') { // Routes venant de express.Router()
            middleware.handle.stack.forEach((handler) => {
            if (handler.route) {
                const path = handler.route.path;
                const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
                console.log(`${methods} ${path}`);
            }
            });
        }
        });
        // END DEBUG
        // Start the server
        this.#app.listen(port, () => {
            console.log(`🚀 Serveur démarré sur le port ${port}`);
        });
    }

    registerRoutes(prefix, routes){
        this.#app.use(prefix, routes);
    }

    registerStatic(path, callback){
        this.#app.use(express.static(path));
        this.#app.get('*', callback);
    }

}

export function createExpress(){
    return new Express();
}
