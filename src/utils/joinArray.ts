export function joinArray<T, U>(arg: Array<T>, split: U) {
  let out: (T | U)[] = []
  for (let i of arg) {
    out.push(i, split)
  }
  out.pop()
  return out
}
