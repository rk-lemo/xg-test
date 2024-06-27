import mongoose from 'mongoose';
import {SampleSchema} from '../schemas/SampleSchema';
import {IDataProcessor} from '../../types/interfaces/general';
import {TAverageData, TParsedData} from '../../types/@reader';
import {Util} from '../../util/util';
import {ISample} from '../../types/interfaces/db';

export class SampleModel implements IDataProcessor {
    private model = mongoose.model<ISample>('Sample', SampleSchema);

    constructor(private cache: Map<string, TAverageData>) {}

    async findAverage(planet: string, from: number, to: number): Promise<TAverageData | undefined> {
        const key = `${planet}_${from}_${to}`;
        if (this.cache.has(key)) {
            return this.cache.get(key)
        }
        const samples = await this.model.find({planet, timestamp: {$gte: from, $lte: to}})
        if (samples.length === 0) {
            return {planet, value: 0.0, processed: 0}
        }
        const result: TAverageData = Util.calculateAverage(samples, planet, from, to)
        this.cache.set(key, result)
        return result
    }

    async install(data: TParsedData[]) {
        const result = await this.model.deleteMany()
        await this.model.insertMany(data)
    }
}
