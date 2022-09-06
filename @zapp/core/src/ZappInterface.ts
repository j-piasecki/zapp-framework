let zappInstance: ZappInterface

export function setZappInterface(zapp: ZappInterface) {
  zappInstance = zapp
}

export abstract class ZappInterface {
  public abstract startLoop(): void
  public abstract stopLoop(): void
}

export const Zapp: ZappInterface = {
  startLoop() {
    zappInstance.startLoop()
  },
  stopLoop() {
    zappInstance.stopLoop()
  },
}
