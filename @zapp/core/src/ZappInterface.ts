let zappInstance: ZappInterface

export function setZappInterface(zapp: ZappInterface) {
  zappInstance = zapp
}

export abstract class ZappInterface {
  public abstract startLoop(): void
  public abstract stopLoop(): void
  public abstract setValue(key: string, value: unknown): void
  public abstract getValue(key: string): unknown
}

export const Zapp: ZappInterface = {
  startLoop() {
    zappInstance.startLoop()
  },
  stopLoop() {
    zappInstance.stopLoop()
  },
  setValue(key, value) {
    zappInstance.setValue(key, value)
  },
  getValue(key) {
    return zappInstance.getValue(key)
  },
}
