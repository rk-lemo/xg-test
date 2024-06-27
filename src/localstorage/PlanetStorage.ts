import {TAverageData, TParsedData} from '../types/@reader';
import {IDataProcessor} from '../types/interfaces/general';
import {Util} from '../util/util';

export class PlanetStorage implements IDataProcessor {
    private parsedData: TParsedData[] = [];

    constructor(private cache: Map<string, TAverageData>) {}

    setParsedData(data: TParsedData[]) {
        this.parsedData = data;
    }

    getParsedData(): TParsedData[] {
        return this.parsedData;
    }

    getFilteredData(planet: string, from: number, to: number) {
        return this.parsedData.filter((data: any) => {
            return data.planet === planet && data.timestamp >= from && data.timestamp <= to
        })
    }

    async findAverage(planet: string, from: number, to: number): Promise<TAverageData | undefined> {
        const key = `${planet}_${from}_${to}`;
        if (this.cache.has(key) && this.cache.get(key) !== undefined) {
            // @ts-ignore
            return this.cache.get(key)
        }
        const data = this.getFilteredData(planet, from, to)
        const result = Util.calculateAverage(data, planet, from, to)
        this.cache.set(key, result)
        return result
    }

}
