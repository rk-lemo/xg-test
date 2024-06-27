import {Readable} from 'stream';
import {TAverageData} from '../types/@reader';

class Util {
     arrayToStream(array: any[]) {
         return new Readable({
            read() {
                for (const item of array) {
                    this.push(JSON.stringify(item) + '\n');
                }
                this.push(null); // Signal end of data
            }
        });
    }

    calculateAverage(data: any[], planet: string, from: number, to: number): TAverageData {
        const count = data.length || 0;
        const sum = data.reduce((acc: number, curr: any) => {
            return acc + parseInt(curr.value)
        }, 0);
        const average = sum / count;
        return {
            planet,
            value: average,
            processed: count
        }
    }
}

const util = new Util();
export {util as Util}
