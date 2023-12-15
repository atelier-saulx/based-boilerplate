export const setDeep = (obj, path, value, setrecursively = false) => {
  path.reduce((a, b, level) => {
    if (
      setrecursively &&
      typeof a[b] === 'undefined' &&
      level !== path.length
    ) {
      a[b] = {}
      return a[b]
    }

    if (level === path.length - 1) {
      a[b] = value
      return value
    }
    return a[b]
  }, obj)
}
