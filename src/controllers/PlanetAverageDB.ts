import express from 'express';

import {TAverageData} from '../types/@reader';
import {IGeneralController} from '../types/interfaces/GeneralController';
import {SampleModel} from '../db/models/Sample';

export default class PlanetAverageDB implements IGeneralController {
    private planetStorage: SampleModel
    constructor(cacheStorage: Map<string, TAverageData>) {
        this.planetStorage = new SampleModel(cacheStorage);
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




