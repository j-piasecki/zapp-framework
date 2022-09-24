export abstract class Color {
  private static toRGB(color: number): [red: number, green: number, blue: number] {
    const r = (color & 0xff0000) >> 16
    const g = (color & 0x00ff00) >> 8
    const b = color & 0x0000ff

    return [r, g, b]
  }

  public static rgb(r: number, g: number, b: number): number {
    return (r << 16) + (g << 8) + b
  }

  public static hsl(h: number, s: number, l: number): number {
    const c = (1 - Math.abs(2 * l - 1)) * s
    const hPrime = h / 60
    const x = c * (1 - Math.abs((hPrime % 2) - 1))
    const m = l - c / 2

    let rgb: number[] = []

    if (hPrime >= 0 && hPrime < 1) {
      rgb = [c, x, 0]
    } else if (hPrime >= 1 && hPrime < 2) {
      rgb = [x, c, 0]
    } else if (hPrime >= 2 && hPrime < 3) {
      rgb = [0, c, x]
    } else if (hPrime >= 3 && hPrime < 4) {
      rgb = [0, x, c]
    } else if (hPrime >= 4 && hPrime < 5) {
      rgb = [x, 0, c]
    } else if (hPrime >= 5 && hPrime < 6) {
      rgb = [c, 0, x]
    }

    const [r, g, b] = rgb.map((v) => Math.floor((v + m) * 255))

    return (r << 16) + (g << 8) + b
  }

  /** @internal */
  public static isDark(color: number): boolean {
    const [r, g, b] = this.toRGB(color)

    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.5
  }

  /** @internal */
  public static tint(color: number, factor: number): number {
    const [r, g, b] = this.toRGB(color)

    return this.rgb(
      Math.floor(r + (255 - r) * factor),
      Math.floor(g + (255 - g) * factor),
      Math.floor(b + (255 - b) * factor)
    )
  }

  /** @internal */
  public static shade(color: number, factor: number): number {
    const [r, g, b] = this.toRGB(color)

    return this.rgb(Math.floor(r * (1 - factor)), Math.floor(g * (1 - factor)), Math.floor(b * (1 - factor)))
  }
}
