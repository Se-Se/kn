export type Values<T extends readonly unknown[]> = T extends { [K in keyof T]: infer U } ? U : never
