import cors     from 'cors';
import express  from 'express';

export class Express {
    
    #app;
    #logger
    #process;

    constructor(process, logger) {
        this.#app = express();
        this.#app.use(cors());
        this.#app.use(express.json());
        this.#process   = process;
        this.#logger    = logger;
    }

    get instance() { return this.#app; }
    get router() { return express.Router(); }

    listen(port) {
        
        const server = this.#app.listen(port, () => {
            this.#logger.log(`🚀 Serveur démarré sur le port ${port}`);
        });

        this.#process.on('SIGTERM', () => this.shutdown(server, 'SIGTERM'));
        this.#process.on('SIGINT',  () => this.shutdown(server, 'SIGINT'));
        
        return server;
    }

    registerRoutes(prefix, routes) {
        this.#app.use(prefix, routes);
    }

    registerStatic(path, callback) {
        this.#app.use(express.static(path));
        this.#app.get('*', callback);
    }

    shutdown(server, signal) {

        this.#logger.log(`\nSignal ${signal} reçu. Arrêt de l'application...`);

        // Sécurité : évite les fermetures multiples si on appuie plusieurs fois sur Ctrl+C
        if (this.isShuttingDown) return;
        this.isShuttingDown = true;

        const timer = setTimeout(() => {
            this.#logger.error("Fermeture forcée (timeout).");
            this.#process.exit(1);
        }, 10000);

        server.close(() => {
            this.#logger.log('Serveur HTTP arrêté.');
/*
            if (this.#connector) {
                this.#connector.closeAll();
                this.#logger.log('Connexions SQLite fermées.');
            }
*/
            clearTimeout(timer); // On annule le timer de sécurité
            this.#process.exit(0);
        });
    }
}

export default function createServer(logger = console) {
    return new Express(process, logger);
}