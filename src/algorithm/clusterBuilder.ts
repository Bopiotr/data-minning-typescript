import {IInstance, IInstanceWithID} from "../Types";
import {DistanceFunctionType} from "../distanes/distancesFunctions";

export class ClusterBuilder {
    public points: IInstanceWithID[] = [];
    public distanceMap: Map<[number, number], number>;
    public max: {key: [number, number], value: number} = {value: -1, key: undefined};
    private pointsKeys: Map<number, [number, number][]>;
    private usedPoints: number[] = [];

    constructor() {
    }

    public build(instances: IInstance[], distanceFunction: DistanceFunctionType): Map<[number, number], number> {
        let iterator = 0;
        if (instances.length <= 1000) {
            this.points = instances.map((item, index) => ({...item, __id: index} as IInstanceWithID));
        } else {
            this.points = this.randomSome(instances).map((item, index) => ({...item, __id: index} as IInstanceWithID));
        }
        const result = new Map<[number, number], number>();
        this.pointsKeys = new Map<number, [number, number][]>();
        this.points.forEach(value => this.pointsKeys.set(value.__id, []));
        for (let indexA = 0; indexA < this.points.length; ++indexA) {
            for (let indexB = indexA + 1; indexB < this.points.length; ++indexB) {
                const distanceAB: number = distanceFunction(this.getPoint(indexA), this.getPoint(indexB));
                const key: [number, number] = [indexA, indexB];
                result.set(key, distanceAB);
                this.pointsKeys.get(indexA).push(key);
                this.pointsKeys.get(indexB).push(key);
                this.max = this.max.value < distanceAB ? {key: [indexA, indexB], value: distanceAB} : this.max;
            }
            console.clear();
            console.log(++iterator, '/' + (this.points.length));
        }
        this.distanceMap = result;
        return this.distanceMap;
    }

    public maxDistance(k: number): number {
        return (this.max.value / k) / 2;
    }

    public getPoint(id: number): IInstance {
        return this.points.find(item => item.__id === id) as IInstance
    }

    public getPointKeys(id: number): [number, number][] {
        const result = this.pointsKeys.get(id).filter(value => !this.usedPoints.includes(value[0]) && !this.usedPoints.includes(value[0]))
        this.pointsKeys.set(id, result);
        return result;
    }

    public deleteById(id: number | number[]): void {
        console.log(id, typeof id);
        if (typeof id === 'number') {
            this.deletePoint(id);
            this.points = this.points.filter(value => value.__id !== id);
            this.max = this.findMax();
            return;
        }
        this.points = this.points.filter(value => !id.includes(value.__id));
        this.usedPoints = [...this.usedPoints, ...id];
        for (const key of this.distanceMap.keys()) {
            const [a, b] = key;
            if (id.includes(a) || id.includes(b)) {
                this.distanceMap.delete(key);
            }
        }
        this.max = this.findMax();
    }

    private deletePoint(id: number): void {
        this.usedPoints.push(id);
        this.deleteInMap(id);
    }

    public findMax(): {key: [number, number], value: number} {
        let max = {value: -1, key: undefined};
        this.distanceMap.forEach((value: number, key) => max = max.value < value ? {key, value} : max)
        return max;
    }


    private deleteInMap(id: number): void {
        for (const key of this.distanceMap.keys()) {
            const [a, b] = key;
            if (a === id || b === id) {
                this.distanceMap.delete(key);
            }
        }
    }

    private randomSome(instances: IInstance[]): IInstance[] {
        const result = [];
        const usedIds = [];
        for(let i = 0; i < 1000; ++i) {
            let index = this.getRandomInt(0, instances.length);
            while (usedIds.includes(index)) {
                index = this.getRandomInt(0, instances.length);
            }
            result.push(instances[index]);
        }
        return result;
    }

    private getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
