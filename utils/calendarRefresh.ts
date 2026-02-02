type Callback = () => void

const subscribers: Callback[] = []

export function subscribe(cb: Callback) {
  subscribers.push(cb)
  return () => {
    const idx = subscribers.indexOf(cb)
    if (idx >= 0) subscribers.splice(idx, 1)
  }
}

export function triggerRefresh() {
  subscribers.slice().forEach((cb) => cb())
}

export default { subscribe, triggerRefresh }
