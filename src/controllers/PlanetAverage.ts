import express from 'express';

import {TAverageData, TParsedData} from '../types/@reader';
import {PlanetStorage} from '../localstorage/PlanetStorage';
import {IGeneralController} from '../types/interfaces/GeneralController';

export default class PlanetAverage implements IGeneralController {
    private planetStorage: PlanetStorage
    constructor(cacheStorage: Map<string, TAverageData>, parsedData: TParsedData[]) {
        this.planetStorage = new PlanetStorage(cacheStorage);
        this.planetStorage.setParsedData(parsedData);
    }

    async handle(req: express.Request, res: express.Response) {
        try {
            const {planet} = req.params;
            const { from, to} = req.query;
            if (!planet || !from || !to) {
                res.status(400).send('Missing parameters');
                return;
            }
            const result = await  this.planetStorage.findAverage(<string>planet, parseInt(from as string), parseInt(to as string));
            res.send(result);
        } catch (error: any) {
            console.error(error.message);
            return res.sendStatus(500);
        }
    }
}




