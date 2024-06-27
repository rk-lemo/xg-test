import {TAverageData} from '../@reader';

export interface IDataProcessor {
    findAverage(planet: string, from: number, to: number): Promise<TAverageData | undefined>;
}
