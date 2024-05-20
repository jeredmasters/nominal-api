import { Md5 } from "ts-md5";

export class IdGenerator {
    sequence: number = 0;
    sequenceBucket: number = 0;
    version = "0";
    getSequence = (bucket: number) => {
        if (this.sequenceBucket !== bucket) {
            this.sequence = 0;
            this.sequenceBucket = bucket;
        }
        const s = this.sequence;

        this.sequence += 1;
        return toHex(s, 3);

    }
    getRandom(width: number) {
        const r = Math.floor(Math.random() * Math.pow(0x10, width));
        return toHex(r, width);
    }
    getChecksum(base: string, width: number) {
        const m = Md5.hashStr(base, true);
        return toHex(m[0], 2)
    }
    getNewUUID = (model: string) => {
        const time = Date.now();

        const timeHex = toHex(time, 12);
        const tttttttt = timeHex.substring(0, 8);
        const tttt = timeHex.substring(8);

        const sssv = this.getSequence(time) + this.version;

        const iiii = "0000"; // todo

        const m = Md5.hashStr(model, true);
        const v = m[0];
        const mmm = toHex(v, 3);
        const rrrrrrr = this.getRandom(7);

        const parts = [
            tttttttt,
            tttt,
            sssv,
            iiii,
            mmm + rrrrrrr
        ];

        const cc = this.getChecksum(parts.join(''), 2);

        return parts.join('-') + cc;
    }

}

const toHex = (num: number, width: number = 0) => {
    let str = Math.abs(num).toString(16);
    while (str.length < width) {
        str = "0" + str;
    }
    if (str.length > width) {
        str = str.substring(0, width);
    }
    return str
}

export const idGenerator = new IdGenerator();