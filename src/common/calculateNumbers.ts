import { NumberInfo } from "../store";

export default function calculateNumbers(originalNumbers: number[], ops: number[]) {
    const numbers: NumberInfo[] = originalNumbers.map(
        (number: number, index: number) => ({
            number,
            index,
            used: false
        })
    );
    const c = Math.floor(ops.length / 3);
    const sub: number[] = ops.slice(0, c * 3);
    for (let i = 0; i < c; i++) {
        const j = i * 3;
        const n1 = numbers[sub[j]];
        const n2 = numbers[sub[j + 2]];
        const a = n1.number;
        const b = n2.number;
        const op = ops[j + 1];
        let number;
        if (op === -1) {
            number = a + b;
        } else if (op === -2) {
            number = a - b;
        } else if (op === -3) {
            number = a * b;
        } else {
            number = a / b;
        }

        numbers.push({ number, used: false, index: numbers.length });
    }

    for (let i = 0; i < ops.length; i++) {
        if (i % 3 !== 1) {
            numbers[ops[i]].used = true;
        }
    }

    return numbers;
}
