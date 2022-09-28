import { ViewManager } from './renderer/ViewManager.js'

let zappInstance: ZappInterface

export enum Platform {
  Web,
  Watch,
}

export enum ScreenShape {
  Square,
  Round,
}

export function setZappInterface(zapp: ZappInterface) {
  zappInstance = zapp
}

export abstract class ZappInterface {
  public abstract startLoop(): void
  public abstract stopLoop(): void
  public abstract setValue(key: string, value: unknown): void
  public abstract getValue(key: string): unknown
  public abstract readonly platform: Platform
  public abstract readonly screenShape: ScreenShape
}

export const Zapp = {
  startLoop() {
    zappInstance.startLoop()
  },
  stopLoop() {
    zappInstance.stopLoop()
  },
  setValue(key: string, value: unknown) {
    zappInstance.setValue(key, value)
  },
  getValue(key: string): unknown {
    return zappInstance.getValue(key)
  },
  get platform() {
    return zappInstance.platform
  },
  get screenShape() {
    return zappInstance.screenShape
  },
  get screenWidth() {
    return ViewManager.screenWidth
  },
  get screenHeight() {
    return ViewManager.screenHeight
  },
}
