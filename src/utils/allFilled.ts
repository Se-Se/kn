export const allFilled = <T extends {}>(v: T): v is {
  [P in keyof T]-?: NonNullable<T[P]>;
} => {
  return Object.values(v).every(Boolean)
}
