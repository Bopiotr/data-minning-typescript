import {IInstance} from '../Types';

export type DistanceFunctionType = (x: IInstance, y: IInstance) => number;

export const defaultDistance: DistanceFunctionType = (x: IInstance, y: IInstance): number => {
    let sum = 0;
    for (const attr in x) {
        let v = x[attr] - y[attr];
        if (v < 0) {
            v = -v;
        }
        sum += Math.pow(v, 2);
    }
    return Math.pow(sum, 0.5);
};

export const euclideanDistance: (attributes: string[]) => DistanceFunctionType = (attributes: string[]): DistanceFunctionType => {
    return (x: IInstance, y: IInstance) => {
        let sum = 0;
        for (const attr of attributes) {
            let v = x[attr] - y[attr];
            if (v < 0) {
                v = -v;
            }
            sum += Math.pow(v, 2);
            if(isNaN(v)) {
                throw Error('NaN!');
            }
        }
        return Math.pow(sum, 0.5);
    }
}

export const pointsDistance: DistanceFunctionType = (a: IInstance, b: IInstance): number => {
    return Math.sqrt((Math.pow(b.x-a.x, 2) + Math.pow(b.y-a.y, 2)));
}

export const minkowskiDistance: (p: number) => DistanceFunctionType = (p: number = 2): DistanceFunctionType => {
    return (x: IInstance, y: IInstance): number => {
        let sum = 0;
        for (const attr in x) {
            let v = x[attr] - y[attr];
            if (v < 0) {
                v = -v;
            }
            sum += Math.pow(v, p);
        }
        return Math.pow(sum, 1/p);
    }
}

export const mhttnDistance: DistanceFunctionType = (x: IInstance, y: IInstance) => {
    let sum = 0;
    for (const attr in x) {
        let v = x[attr] - y[attr];
        if (v < 0) {
            v = -v;
        }
        sum += v;
    }
    return sum;
}

export const hammingDistance: DistanceFunctionType = (x: IInstance, y: IInstance) => {
    let result = 0;
    for (const attr in x) {
        if (x[attr] !== y[attr]) {
            ++result;
        }
    }
    return result;
}
