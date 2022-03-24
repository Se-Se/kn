export type MustbeProject<T> = T extends { __typename?: 'Project' | undefined } ? T : never
export type Mustbe<T> = NonNullable<T>
export type ArrayItem<T> = T extends Array<infer U> ? U : never
export type GetArrayElementType<T extends readonly any[]> = T extends readonly (infer U)[] ? U : never;
