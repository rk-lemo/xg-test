import express from 'express';

export interface IGeneralController  {
    handle: (req: express.Request, res: express.Response, ) => Promise<any>;
}
