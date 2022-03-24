export function withStatic<T, U>(component: T, obj: U): T & U {
  for (const [key, value] of Object.entries(obj)) {
    (component as any)[key] = value
  }
  return component as T & U
}
