import { Zapp } from '@zapp-framework/core'

const SAVED_THEME_KEY = 'zapp#theme'

export interface ThemeInterface {
  primary: number
  onPrimary: number
  primaryContainer: number
  onPrimaryContainer: number

  secondary: number
  onSecondary: number
  secondaryContainer: number
  onSecondaryContainer: number

  tertiary: number
  onTertiary: number
  tertiaryContainer: number
  onTertiaryContainer: number

  error: number
  onError: number
  errorContainer: number
  onErrorContainer: number

  background: number
  onBackground: number
  surface: number
  onSurface: number

  outline: number
  surfaceVariant: number
  onSurfaceVariant: number
}

// generated using https://m3.material.io/theme-builder#/custom with #db367e as a primary color
let currentTheme: ThemeInterface = (Zapp.getValue(SAVED_THEME_KEY) as ThemeInterface) ?? {
  primary: 0xffb1c8,
  onPrimary: 0x650033,
  primaryContainer: 0x8e004a,
  onPrimaryContainer: 0xffd9e2,

  secondary: 0xe3bdc6,
  onSecondary: 0x422931,
  secondaryContainer: 0x5a3f47,
  onSecondaryContainer: 0xffd9e2,

  tertiary: 0xefbd94,
  onTertiary: 0x48290b,
  tertiaryContainer: 0x613f20,
  onTertiaryContainer: 0xffdcc1,

  error: 0xffb4ab,
  onError: 0x690005,
  errorContainer: 0x93000a,
  onErrorContainer: 0xffdad6,

  background: 0x000000,
  onBackground: 0xebe0e1,
  surface: 0x201a1b,
  onSurface: 0xebe0e1,

  outline: 0x9e8c90,
  surfaceVariant: 0x514347,
  onSurfaceVariant: 0xd5c2c6,
}

export function setTheme(theme?: ThemeInterface) {
  if (theme !== undefined) {
    currentTheme = theme
  }

  Zapp.setValue(SAVED_THEME_KEY, theme)
}

export abstract class Theme {
  static get primary() {
    return currentTheme.primary
  }
  static get onPrimary() {
    return currentTheme.onPrimary
  }
  static get primaryContainer() {
    return currentTheme.primaryContainer
  }
  static get onPrimaryContainer() {
    return currentTheme.onPrimaryContainer
  }

  static get secondary() {
    return currentTheme.secondary
  }
  static get onSecondary() {
    return currentTheme.onSecondary
  }
  static get secondaryContainer() {
    return currentTheme.secondaryContainer
  }
  static get onSecondaryContainer() {
    return currentTheme.onSecondaryContainer
  }

  static get tertiary() {
    return currentTheme.tertiary
  }
  static get onTertiary() {
    return currentTheme.onTertiary
  }
  static get tertiaryContainer() {
    return currentTheme.tertiaryContainer
  }
  static get onTertiaryContainer() {
    return currentTheme.onTertiaryContainer
  }

  static get error() {
    return currentTheme.error
  }
  static get onError() {
    return currentTheme.onError
  }
  static get errorContainer() {
    return currentTheme.errorContainer
  }
  static get onErrorContainer() {
    return currentTheme.onErrorContainer
  }

  static get background() {
    return currentTheme.background
  }
  static get onBackground() {
    return currentTheme.onBackground
  }
  static get surface() {
    return currentTheme.surface
  }
  static get onSurface() {
    return currentTheme.onSurface
  }

  static get outline() {
    return currentTheme.outline
  }
  static get surfaceVariant() {
    return currentTheme.surfaceVariant
  }
  static get onSurfaceVariant() {
    return currentTheme.onSurfaceVariant
  }
}
