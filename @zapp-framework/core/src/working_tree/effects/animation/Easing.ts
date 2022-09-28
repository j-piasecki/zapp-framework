// most of the logic borrowed from https://github.com/software-mansion/react-native-reanimated/blob/3c8f7d013645e77d476004698981b6d526bdb806/src/reanimated2/Bezier.ts

const NEWTON_ITERATIONS = 8
const NEWTON_MIN_SLOPE = 0.001
const SUBDIVISION_PRECISION = 0.001
const SUBDIVISION_MAX_ITERATIONS = 10

function bezier(t: number, p1: number, p2: number): number {
  return 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t
}

function bezierSlope(t: number, p1: number, p2: number): number {
  return 3 * (1 - t) * (1 - t) * p1 + 6 * (1 - t) * t * (p2 - p1) + 3 * t * t * (1 - p2)
}

function newtonRaphsonIterate(x: number, t: number, x1: number, x2: number): number {
  for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
    const currentSlope = bezierSlope(t, x1, x2)
    if (currentSlope === 0.0) {
      return t
    }
    const currentX = bezier(t, x1, x2) - x
    t -= currentX / currentSlope
  }
  return t
}

function binarySubdivide(x: number, a: number, b: number, x1: number, x2: number): number {
  let currentX
  let currentT
  let i = 0
  do {
    currentT = a + (b - a) / 2.0
    currentX = bezier(currentT, x1, x2) - x
    if (currentX > 0.0) {
      b = currentT
    } else {
      a = currentT
    }
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS)
  return currentT
}

function getTForX(x: number, mX1: number, mX2: number): number {
  const initialSlope = bezierSlope(x, mX1, mX2)
  if (initialSlope >= NEWTON_MIN_SLOPE) {
    return newtonRaphsonIterate(x, x, mX1, mX2)
  } else if (initialSlope === 0.0) {
    return x
  } else {
    return binarySubdivide(x, 0, 1, mX1, mX2)
  }
}

function makeBezierEasing(x1: number, y1: number, x2: number, y2: number): (t: number) => number {
  return (t: number) => {
    if (t === 0) {
      return 0
    }
    if (t === 1) {
      return 1
    }
    return bezier(getTForX(t, x1, x2), y1, y2)
  }
}

export abstract class Easing {
  public static linear(t: number): number {
    return t
  }

  public static ease = makeBezierEasing(0.28, 0.17, 0.27, 1)
  public static easeInQuad = makeBezierEasing(0.11, 0, 0.5, 0)
  public static easeOutQuad = makeBezierEasing(0.5, 1, 0.89, 1)
  public static easeInOutQuad = makeBezierEasing(0.45, 0, 0.55, 1)
  public static easeInCubic = makeBezierEasing(0.32, 0, 0.67, 0)
  public static easeOutCubic = makeBezierEasing(0.33, 1, 0.68, 1)
  public static easeInOutCubic = makeBezierEasing(0.65, 0, 0.35, 1)
}
