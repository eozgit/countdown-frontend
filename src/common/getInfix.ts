function getOperation(code: string) {
  switch (code) {
    case "-1":
      return "+";
    case "-2":
      return "-";
    case "-3":
      return "*";
    case "-4":
      return "/";
  }
}

export default function getInfix(numbers: number[], ops: number[]) {
  const n = numbers.map(i => i.toString());
  const count = Math.floor(ops.length / 3);

  for (let i = 0; i < count; i++) {
    const j = i * 3;

    const ai = ops[j];
    let a = n[ai];
    if (ai >= 6) {
      a = `(${a})`;
    }

    const bi = ops[j + 2];
    let b = n[bi];
    if (bi >= 6) {
      b = `(${b})`;
    }

    const op = getOperation(ops[j + 1].toString());
    n.push(`${a} ${op} ${b}`);
  }

  return n[n.length - 1];
}
