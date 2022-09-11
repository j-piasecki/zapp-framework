export abstract class Color {
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
}
