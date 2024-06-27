import express from 'express';
import {IGeneralController} from '../types/interfaces/GeneralController';

export function wrap(controller: IGeneralController){
    return (req: express.Request, res: express.Response) => controller.handle(req, res);
}
