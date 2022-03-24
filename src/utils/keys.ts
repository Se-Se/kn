export const keys = <O extends {}>(o: O) => {
  return Object.keys(o) as (keyof O)[]
}
