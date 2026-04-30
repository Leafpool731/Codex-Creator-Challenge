import { clamp } from "@/components/portrait/featureMasks";

interface FrecklesOverlayProps {
  freckles: number;
  seed?: number;
}

interface Freckle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  blur: number;
  color: string;
}

const freckleColors = [
  [95, 58, 38],
  [120, 75, 48],
  [70, 45, 32]
] as const;

function createRandom(seed: number): () => number {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);

    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(random: () => number): number {
  const first = Math.max(random(), 0.0001);
  const second = random();

  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

export function generateFreckles(seed: number, count: number): Freckle[] {
  const random = createRandom(seed);
  const freckles: Freckle[] = [];

  for (let index = 0; index < count; index += 1) {
    const denseCenter = random() < 0.72;
    const spreadX = denseCenter ? 5.8 : 9.8;
    const spreadY = denseCenter ? 2.4 : 4.3;
    const x = Math.max(35, Math.min(65, 50 + gaussian(random) * spreadX));
    const y = Math.max(40, Math.min(52, 46.5 + gaussian(random) * spreadY));
    const distanceFromCenter = Math.hypot((x - 50) / 15, (y - 46.5) / 6);
    const centerFade = Math.max(0.35, 1 - distanceFromCenter * 0.34);
    const opacity = (0.15 + random() * 0.3) * centerFade;
    const [r, g, b] = freckleColors[Math.floor(random() * freckleColors.length)];

    freckles.push({
      x,
      y,
      size: 0.8 + random() * 2,
      opacity,
      blur: random() * 0.6,
      color: `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(3)})`
    });
  }

  return freckles;
}

const frecklePool = generateFreckles(7301, 120);

export function FrecklesOverlay({ freckles, seed = 7301 }: FrecklesOverlayProps) {
  const intensity = clamp(freckles) / 100;

  if (intensity <= 0) {
    return null;
  }

  const count = Math.round(12 + intensity * 88);
  const visibleFreckles =
    seed === 7301 ? frecklePool.slice(0, count) : generateFreckles(seed, count);

  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        opacity: 0.32 + intensity * 0.58,
        mixBlendMode: "multiply"
      }}
    >
      {visibleFreckles.map((freckle, index) => (
        <span
          key={`${freckle.x.toFixed(2)}-${freckle.y.toFixed(2)}-${index}`}
          className="absolute rounded-full"
          style={{
            left: `${freckle.x}%`,
            top: `${freckle.y}%`,
            width: `${freckle.size}px`,
            height: `${freckle.size}px`,
            backgroundColor: freckle.color,
            filter: `blur(${freckle.blur.toFixed(2)}px)`,
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
    </div>
  );
}
