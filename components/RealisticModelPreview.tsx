"use client";

import { useId } from "react";
import {
  eyeColorOptions,
  getOptionHex,
  hairColorOptions,
  lipColorOptions,
  skinToneOptions,
  type ModelState
} from "@/lib/modelState";

interface RealisticModelPreviewProps {
  state: ModelState;
  compact?: boolean;
  onResetView?: () => void;
}

const freckles = [
  [214, 330, 2.2],
  [230, 314, 1.5],
  [246, 350, 1.8],
  [286, 326, 1.6],
  [306, 342, 2.1],
  [196, 356, 1.7],
  [322, 362, 1.4],
  [270, 372, 1.3],
  [236, 382, 1.2],
  [300, 306, 1.1],
  [220, 366, 1.2],
  [314, 324, 1.1]
];

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const value = parseInt(normalized, 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((value) => Math.round(value).toString(16).padStart(2, "0"))
    .join("")}`;
}

function mix(colorA: string, colorB: string, amount: number): string {
  const first = hexToRgb(colorA);
  const second = hexToRgb(colorB);
  const ratio = Math.max(0, Math.min(1, amount));

  return rgbToHex(
    first.r + (second.r - first.r) * ratio,
    first.g + (second.g - first.g) * ratio,
    first.b + (second.b - first.b) * ratio
  );
}

function rgba(hex: string, alpha: number): string {
  const color = hexToRgb(hex);
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function getSkinBase(state: ModelState): string {
  const tone =
    skinToneOptions.find((option) => option.id === state.skinTone) ??
    skinToneOptions[2];
  const undertoneColor =
    state.undertone < 42 ? "#d8cce3" : state.undertone > 60 ? "#e9b36f" : "#d8c4b4";
  const undertoneMix = Math.abs(state.undertone - 50) / 155;
  const saturated = mix(tone.hex, undertoneColor, undertoneMix);
  const muted = mix(saturated, "#c6b5aa", (100 - state.chroma) / 420);

  return mix(muted, tone.hex, 0.48);
}

export function RealisticModelPreview({
  state,
  compact = false,
  onResetView
}: RealisticModelPreviewProps) {
  const id = useId().replace(/:/g, "");
  const skinBase = getSkinBase(state);
  const skinHighlight = mix(skinBase, "#fff8ef", 0.42);
  const skinMid = mix(skinBase, "#d9a48e", 0.16);
  const skinShadow = mix(skinBase, "#2b1714", 0.28);
  const blushColor = state.undertone < 45 ? "#b85f7a" : "#d87462";
  const hair = getOptionHex(hairColorOptions, state.hairColor);
  const hairLight = mix(hair, "#fff0d7", 0.18);
  const hairShadow = mix(hair, "#090606", 0.38);
  const eye = getOptionHex(eyeColorOptions, state.eyeColor);
  const lip = getOptionHex(lipColorOptions, state.lipColor);
  const lightColor = mix("#d9e5f4", "#f6c79b", state.lightWarmth / 100);
  const environment = mix("#6c5c55", "#fff8f1", state.environmentBrightness / 100);
  const lightOpacity = 0.2 + state.lightIntensity / 260;
  const blushOpacity = state.blush / 140;
  const freckleOpacity = state.freckles / 115;

  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_32px_90px_rgba(83,60,50,0.18)] ${
        compact ? "aspect-[4/5] min-h-44" : "min-h-[34rem]"
      }`}
      style={{
        background:
          `radial-gradient(circle at 36% 18%, ${rgba(lightColor, lightOpacity)} 0%, transparent 36%), ` +
          `radial-gradient(circle at 72% 34%, ${rgba("#ffffff", 0.25)} 0%, transparent 34%), ` +
          `linear-gradient(145deg, ${environment}, ${mix(environment, "#d4b8a9", 0.36)})`
      }}
      data-model-slot="svg-fallback-glb-ready"
    >
      {!compact && onResetView ? (
        <button
          type="button"
          onClick={onResetView}
          className="absolute right-4 top-4 z-20 rounded-full border border-white/70 bg-white/72 px-4 py-2 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur transition hover:border-[#9b786f]"
        >
          Reset view
        </button>
      ) : null}

      {/* Isolated premium SVG fallback: this component can later swap its inner stage for a GLB renderer. */}
      <svg
        viewBox="0 0 520 680"
        role="img"
        aria-label="Realistic editable portrait preview for image-free color analysis"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <radialGradient id={`${id}-skin`} cx="44%" cy="28%" r="70%">
            <stop offset="0%" stopColor={skinHighlight} />
            <stop offset="42%" stopColor={skinBase} />
            <stop offset="74%" stopColor={skinMid} />
            <stop offset="100%" stopColor={skinShadow} />
          </radialGradient>
          <linearGradient id={`${id}-hair`} x1="18%" y1="4%" x2="88%" y2="92%">
            <stop offset="0%" stopColor={hairLight} />
            <stop offset="45%" stopColor={hair} />
            <stop offset="100%" stopColor={hairShadow} />
          </linearGradient>
          <radialGradient id={`${id}-iris`} cx="44%" cy="38%" r="62%">
            <stop offset="0%" stopColor={mix(eye, "#ffffff", 0.45)} />
            <stop offset="58%" stopColor={eye} />
            <stop offset="100%" stopColor={mix(eye, "#050505", 0.34)} />
          </radialGradient>
          <linearGradient id={`${id}-lip`} x1="18%" y1="18%" x2="82%" y2="90%">
            <stop offset="0%" stopColor={mix(lip, "#fff0ea", 0.22)} />
            <stop offset="56%" stopColor={lip} />
            <stop offset="100%" stopColor={mix(lip, "#2a1016", 0.24)} />
          </linearGradient>
          <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="20" stdDeviation="18" floodColor="#4b312b" floodOpacity="0.22" />
          </filter>
          <filter id={`${id}-soften`}>
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <path
          d="M78 600 C120 524 181 496 260 496 C339 496 400 524 442 600 L442 690 L78 690 Z"
          fill={mix("#efe0d7", skinBase, 0.28)}
          opacity="0.95"
        />
        <path
          d="M212 470 C224 520 296 520 308 470 L322 578 C300 604 219 604 198 578 Z"
          fill={`url(#${id}-skin)`}
          opacity="0.98"
        />
        <path
          d="M119 242 C122 124 174 59 258 52 C347 45 406 124 407 248 C433 290 428 375 397 431 C371 481 323 522 260 522 C197 522 149 481 123 431 C92 375 87 290 119 242 Z"
          fill={`url(#${id}-hair)`}
          filter={`url(#${id}-shadow)`}
        />
        <path
          d="M152 247 C157 147 198 105 260 105 C322 105 363 147 368 247 C376 396 327 486 260 486 C193 486 144 396 152 247 Z"
          fill={`url(#${id}-skin)`}
        />
        <path
          d="M150 252 C157 143 210 91 277 108 C245 118 215 151 198 202 C184 244 177 304 160 354 C150 326 147 291 150 252 Z"
          fill={rgba("#ffffff", 0.13)}
        />
        <path
          d="M158 229 C180 128 230 84 297 99 C343 110 374 162 377 245 C349 188 305 156 257 155 C210 154 178 184 158 229 Z"
          fill={`url(#${id}-hair)`}
        />
        <path
          d="M178 200 C209 128 279 92 347 152 C323 128 283 116 239 132 C205 145 185 169 178 200 Z"
          fill={rgba("#fff9ee", 0.18)}
        />

        <ellipse cx="185" cy="312" rx="15" ry="34" fill={skinShadow} opacity="0.18" />
        <ellipse cx="335" cy="312" rx="15" ry="34" fill={skinShadow} opacity="0.18" />

        <path d="M195 280 C217 268 238 269 255 283" fill="none" stroke={mix(hair, "#080808", 0.2)} strokeWidth="6" strokeLinecap="round" opacity="0.86" />
        <path d="M325 280 C303 268 282 269 265 283" fill="none" stroke={mix(hair, "#080808", 0.2)} strokeWidth="6" strokeLinecap="round" opacity="0.86" />

        <g>
          <path d="M198 314 C214 299 239 300 251 315 C239 329 213 330 198 314 Z" fill="#fff7ef" opacity="0.94" />
          <circle cx="225" cy="314" r="10" fill={`url(#${id}-iris)`} />
          <circle cx="225" cy="314" r="4" fill="#15100f" />
          <circle cx="221" cy="310" r="2.2" fill="#ffffff" opacity="0.9" />
          <path d="M198 314 C214 301 238 300 251 315" fill="none" stroke="#3b2722" strokeWidth="2.2" strokeLinecap="round" opacity="0.42" />
        </g>
        <g>
          <path d="M322 314 C306 299 281 300 269 315 C281 329 307 330 322 314 Z" fill="#fff7ef" opacity="0.94" />
          <circle cx="295" cy="314" r="10" fill={`url(#${id}-iris)`} />
          <circle cx="295" cy="314" r="4" fill="#15100f" />
          <circle cx="291" cy="310" r="2.2" fill="#ffffff" opacity="0.9" />
          <path d="M322 314 C306 301 282 300 269 315" fill="none" stroke="#3b2722" strokeWidth="2.2" strokeLinecap="round" opacity="0.42" />
        </g>

        <path d="M260 323 C252 356 248 380 239 401 C250 412 273 413 283 401 C272 380 268 356 260 323 Z" fill={skinShadow} opacity="0.14" />
        <path d="M249 397 C257 404 269 404 278 397" fill="none" stroke={rgba("#5a3028", 0.28)} strokeWidth="2" strokeLinecap="round" />
        <path d="M210 368 C229 356 246 358 254 368" fill="none" stroke={rgba("#703b35", 0.08)} strokeWidth="9" strokeLinecap="round" filter={`url(#${id}-soften)`} />
        <path d="M310 368 C291 356 274 358 266 368" fill="none" stroke={rgba("#703b35", 0.08)} strokeWidth="9" strokeLinecap="round" filter={`url(#${id}-soften)`} />

        <ellipse cx="210" cy="378" rx="36" ry="20" fill={blushColor} opacity={blushOpacity} filter={`url(#${id}-soften)`} />
        <ellipse cx="310" cy="378" rx="36" ry="20" fill={blushColor} opacity={blushOpacity} filter={`url(#${id}-soften)`} />

        <g opacity={freckleOpacity}>
          {freckles.map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill={mix(skinShadow, "#8a563e", 0.35)} opacity="0.55" />
          ))}
        </g>

        <path
          d="M223 435 C243 422 278 422 298 435 C285 454 238 454 223 435 Z"
          fill={`url(#${id}-lip)`}
          opacity="0.95"
        />
        <path d="M226 435 C247 439 274 439 296 435" fill="none" stroke={rgba("#fff6ef", 0.32)} strokeWidth="2" strokeLinecap="round" />

        <path
          d="M154 250 C141 343 155 434 214 490 C154 459 118 397 110 315 C102 228 128 151 189 103 C165 144 156 193 154 250 Z"
          fill={hairShadow}
          opacity="0.62"
        />
        <path
          d="M366 250 C379 343 365 434 306 490 C366 459 402 397 410 315 C418 228 392 151 331 103 C355 144 364 193 366 250 Z"
          fill={hairShadow}
          opacity="0.62"
        />

        <rect
          x="0"
          y="0"
          width="520"
          height="680"
          fill={lightColor}
          opacity={0.04 + state.lightIntensity / 620}
          style={{ mixBlendMode: "soft-light" }}
        />
      </svg>
    </div>
  );
}
