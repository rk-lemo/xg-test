import fs from 'fs/promises';
import {TParsedData} from '../types/@reader';

export class Reader {
    private filePath: string = process.env.DATA_PATH || './xg-samples.log';

    async read(): Promise<TParsedData[]> {
        const data: string = await fs.readFile(this.filePath, 'utf8');
        return this.prepareData(data);
    }

    prepareData(data: string): TParsedData[] {
        const result: TParsedData[] = []
        const dataAsArray = data.split('\n');
        dataAsArray.forEach((line: string) => {
            const [timestamp, planet, value] = line.split(',');
            if (timestamp && planet && value) {
                result.push({
                    timestamp: parseInt(timestamp),
                    planet,
                    value: parseFloat(value)
                })
            }
        });
        return result
    }
}
