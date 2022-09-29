import { RememberedMutableValue, rememberObservable } from '@zapp-framework/core'

function stringToArrayBuffer(str: string) {
  const buf = new ArrayBuffer(str.length * 2) // 2 bytes for each char
  const bufView = new Uint16Array(buf)
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i)
  }
  return buf
}

const FILE_NAME = 'zapp_key_value.txt'

export abstract class KeyValueStorage {
  public static get values(): Record<string, unknown> {
    return getApp()._options.globalData._keyValue
  }

  private static set values(data: Record<string, unknown>) {
    getApp()._options.globalData._keyValue = data
  }

  public static save() {
    const file = hmFS.open(FILE_NAME, hmFS.O_CREAT | hmFS.O_RDWR | hmFS.O_TRUNC)
    const contentBuffer = stringToArrayBuffer(JSON.stringify(this.values))

    hmFS.write(file, contentBuffer, 0, contentBuffer.byteLength)
    hmFS.close(file)
  }

  public static load() {
    const [fsStat, err] = hmFS.stat(FILE_NAME)
    if (err === 0) {
      const { size } = fsStat
      const fileContentUnit = new Uint16Array(new ArrayBuffer(size))
      const file = hmFS.open(FILE_NAME, hmFS.O_RDONLY | hmFS.O_CREAT)
      hmFS.seek(file, 0, hmFS.SEEK_SET)
      hmFS.read(file, fileContentUnit.buffer, 0, size)
      hmFS.close(file)

      try {
        // @ts-ignore
        const val = String.fromCharCode.apply(null, fileContentUnit)
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        KeyValueStorage.values = val ? JSON.parse(val) : {}
      } catch (error) {
        KeyValueStorage.values = {}
      }
    }
  }
}

const rememberedValues = new Map<string, RememberedMutableValue<unknown>[]>()

export function rememberSavable<T>(key: string, defaultValue: T) {
  const value = rememberObservable(defaultValue, (previous, current) => {
    KeyValueStorage.values[key] = current

    const saved = rememberedValues.get(key)
    if (saved !== undefined) {
      for (const val of saved) {
        val.value = current
      }
    }
  })

  const savedValue = KeyValueStorage.values[key]
  if (savedValue !== undefined) {
    value.value = savedValue as T
  }

  const saved = rememberedValues.get(key) ?? []
  if (saved.indexOf(value) === -1) {
    saved.push(value)
    rememberedValues.set(key, saved)
  }

  return value
}
