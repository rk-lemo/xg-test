require('dotenv').config();

import {Mongoose} from 'mongoose';
import * as awilix from 'awilix';
import express from 'express';

import {Reader} from './localstorage/Reader';
import Connection from './db/connection';
import {wrap} from './util/RequestWrap';

import FullSample from './controllers/FullSample';
import PlanetAverage from './controllers/PlanetAverage';
import PlanetAverageDB from './controllers/PlanetAverageDB';

import {TAverageData} from './types/@reader';

const app = express();
const LocalCache = new Map<string, TAverageData>()
const ReaderInstance = new Reader();

const PORT = process.env.PORT || 3000;

export default class App {
    private dbConnection: Mongoose | null = null;
    private app: express.Express | null = null;
    container: awilix.AwilixContainer = awilix.createContainer({
        injectionMode: awilix.InjectionMode.CLASSIC,
        strict: true
    });

    /**
     * @description Initialize the app and start the server
     * @returns {Promise<void>}
     */
    async initialize(): Promise<void> {
        this.setOnShutDownHook();
        const connection = await this.connectDb();
        const parsedData = await ReaderInstance.read();
        this.container.register({
            dbConnection: awilix.asValue(connection),
            cacheStorage: awilix.asValue(LocalCache),
            PlanetAverageLocalstorage: awilix.asClass(PlanetAverage),
            PlanetAverageDB: awilix.asClass(PlanetAverageDB),
            FullSample: awilix.asClass(FullSample),
            parsedData: awilix.asValue(parsedData)
        });
        this.initServer();
    }

    /**
     * @description Initialize the server for the app and start listening on the port
     * @returns {void}
     */
    initServer(): void {
        this.app = express();
        this.app.use(express.json());
        this.app.use(this.initRouter())
        this.app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    }

    /**
     * @description Initialize the router for the app and return it
     * @returns {express.Router}
     */
    initRouter(): express.Router {
        const router: express.Router = express.Router();
        router.get('/:planet/average', wrap(this.container.resolve('PlanetAverageLocalstorage')));
        router.get('/:planet/average-db', wrap(this.container.resolve('PlanetAverageDB')));
        router.get('/data', wrap(this.container.resolve('FullSample')));
        return router;
    }

    async connectDb(): Promise<Mongoose> {
        try {
            this.dbConnection = await new Connection().connect();
            return this.dbConnection;
        } catch (error) {
            throw error;
        }
    }

    /**
     * @description Set on shutdown hook for the app
     * @private
     */
    private setOnShutDownHook(): void {
        process.on('SIGTERM', (err) => this.stop('SIGTERM', err))
        process.on('SIGINT', (err) => this.stop('SIGINT', err))
        process.on('SIGQUIT', (err) => this.stop('SIGINT', err))
    }

    /**
     * @description Stop the server and close the db connection
     * @param {string} signal
     * @param {string | number} error
     * @private
     */
    private stop(signal: string, error: string | number) {
        if (this.dbConnection) {
            this.dbConnection.connection?.close(true);
        }
        console.error(signal, error);
        process.exit(1);
    }
}




