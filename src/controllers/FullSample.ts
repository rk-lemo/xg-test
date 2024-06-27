import express from 'express';

import {TAverageData, TParsedData} from '../types/@reader';
import {PlanetStorage} from '../localstorage/PlanetStorage';
import {IGeneralController} from '../types/interfaces/GeneralController';
import {Util} from '../util/util';

export default class FullSample implements IGeneralController {
    private planetStorage: PlanetStorage
    constructor(cacheStorage: Map<string, TAverageData>, parsedData: TParsedData[]) {
        this.planetStorage = new PlanetStorage(cacheStorage);
        this.planetStorage.setParsedData(parsedData);
    }

    async handle(req: express.Request, res: express.Response) {
        try {
            return Util.arrayToStream(this.planetStorage.getParsedData()).pipe(res);
        } catch (error: any) {
            console.error(error.message);
            return res.sendStatus(500);
        }
    }
}




