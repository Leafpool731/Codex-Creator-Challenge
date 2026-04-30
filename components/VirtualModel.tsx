"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import type { PaletteColor, UserSelections } from "@/lib/types";
import { getAttributeOption, getInitialSelections } from "@/lib/attributes";

interface VirtualModelProps {
  selections?: UserSelections;
  palette?: PaletteColor[];
  className?: string;
}

interface AvatarLook {
  skin: string;
  undertone: string;
  hair: string;
  eye: string;
  lip: string;
  brow: string;
  jewelry: string;
}

type LightingPresetId =
  | "natural-daylight"
  | "warm-vanity"
  | "cool-studio"
  | "golden-hour";

interface LightingPreset {
  id: LightingPresetId;
  label: string;
  background: string;
  key: string;
  fill: string;
  rim: string;
  ambient: string;
  intensity: {
    key: number;
    fill: number;
    rim: number;
    ambient: number;
  };
}

const lightingPresets: LightingPreset[] = [
  {
    id: "natural-daylight",
    label: "Natural daylight",
    background: "linear-gradient(160deg, #f6f1e8 0%, #efe6d9 48%, #e8dfd1 100%)",
    key: "#f5efe4",
    fill: "#ede7dc",
    rim: "#f9f7f2",
    ambient: "#e8dfcf",
    intensity: { key: 2.2, fill: 1.1, rim: 1.2, ambient: 0.8 }
  },
  {
    id: "warm-vanity",
    label: "Warm vanity",
    background: "linear-gradient(155deg, #f7eadf 0%, #f0d8c8 45%, #e5c9b7 100%)",
    key: "#ffd9b8",
    fill: "#f4d4bf",
    rim: "#fff0d9",
    ambient: "#f0c9a9",
    intensity: { key: 2.3, fill: 1.2, rim: 1.3, ambient: 0.85 }
  },
  {
    id: "cool-studio",
    label: "Cool studio",
    background: "linear-gradient(150deg, #f2f0ef 0%, #e3e1e5 50%, #d7d9df 100%)",
    key: "#edf2ff",
    fill: "#e7eaf4",
    rim: "#f7fbff",
    ambient: "#d7dbe8",
    intensity: { key: 2.35, fill: 1.15, rim: 1.35, ambient: 0.82 }
  },
  {
    id: "golden-hour",
    label: "Golden hour",
    background: "linear-gradient(150deg, #f8e7d8 0%, #f1d1b5 50%, #dbb394 100%)",
    key: "#ffd1a5",
    fill: "#f5c9a9",
    rim: "#ffdfbf",
    ambient: "#e7b28f",
    intensity: { key: 2.4, fill: 1.15, rim: 1.45, ambient: 0.86 }
  }
];

function isWarmTemperature(value?: string): boolean {
  return value === "warm" || value === "neutral-warm";
}

function pickLipColor(temperature?: string, chroma?: string): string {
  if (isWarmTemperature(temperature)) {
    return chroma === "bright" ? "#d37d67" : "#bc7568";
  }

  if (temperature === "cool" || temperature === "neutral-cool") {
    return chroma === "bright" ? "#ba6e84" : "#a56a7d";
  }

  return "#b47477";
}

function buildAvatarLook(selections: UserSelections): AvatarLook {
  const skin = getAttributeOption("skinDepth", selections.skinDepth);
  const undertone = getAttributeOption("undertone", selections.undertone);
  const chroma = getAttributeOption("chroma", selections.chroma);
  const contrast = getAttributeOption("contrast", selections.contrast);
  const eyes = getAttributeOption("eyeColor", selections.eyeColor);
  const hair = getAttributeOption("hairColor", selections.hairColor);

  const hairDepth = hair.depthValue ?? 4;
  const brow =
    hairDepth <= 1
      ? "#74655a"
      : contrast.value === "high"
        ? "#241f1f"
        : hair.hex ?? "#4e3026";

  return {
    skin: skin.hex ?? "#d7a37f",
    undertone: undertone.temperature ?? "neutral",
    hair: hair.hex ?? "#5f3a29",
    eye: eyes.hex ?? "#5f7060",
    lip: pickLipColor(undertone.temperature, chroma.value),
    brow,
    jewelry: contrast.value === "high" ? "#d8d5d2" : "#c8b09c"
  };
}

function HairShape({ look }: { look: AvatarLook }) {
  return (
    <group position={[0, 0.56, -0.04]}>
      <mesh castShadow>
        <sphereGeometry args={[0.68, 64, 64, 0, Math.PI * 2, 0.06, Math.PI * 0.95]} />
        <meshPhysicalMaterial color={look.hair} roughness={0.55} metalness={0.06} />
      </mesh>
      <mesh position={[-0.38, -0.08, -0.2]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial color={look.hair} roughness={0.58} metalness={0.05} />
      </mesh>
      <mesh position={[0.38, -0.08, -0.2]} castShadow>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshPhysicalMaterial color={look.hair} roughness={0.58} metalness={0.05} />
      </mesh>
    </group>
  );
}

function FaceFeatures({ look }: { look: AvatarLook }) {
  return (
    <group position={[0, 0.34, 0.55]}>
      <mesh position={[-0.2, 0.04, 0.04]}>
        <sphereGeometry args={[0.074, 24, 24]} />
        <meshPhysicalMaterial color={look.eye} roughness={0.14} metalness={0.05} clearcoat={0.45} />
      </mesh>
      <mesh position={[0.2, 0.04, 0.04]}>
        <sphereGeometry args={[0.074, 24, 24]} />
        <meshPhysicalMaterial color={look.eye} roughness={0.14} metalness={0.05} clearcoat={0.45} />
      </mesh>
      <mesh position={[-0.2, 0.07, 0.055]} rotation={[0.22, 0.12, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={look.brow} roughness={0.7} />
      </mesh>
      <mesh position={[0.2, 0.07, 0.055]} rotation={[0.22, -0.12, 0]}>
        <sphereGeometry args={[0.1, 20, 20]} />
        <meshStandardMaterial color={look.brow} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.02, 0.055]} rotation={[0.12, 0, 0]} castShadow>
        <capsuleGeometry args={[0.02, 0.15, 10, 18]} />
        <meshStandardMaterial color={look.skin} roughness={0.46} metalness={0.03} />
      </mesh>
      <mesh position={[0, -0.2, 0.08]} rotation={[0.04, 0, 0]} castShadow>
        <sphereGeometry args={[0.095, 28, 28]} />
        <meshPhysicalMaterial color={look.lip} roughness={0.36} metalness={0.04} clearcoat={0.2} />
      </mesh>
      <mesh position={[0, -0.227, 0.086]} rotation={[-0.06, 0, 0]} castShadow>
        <sphereGeometry args={[0.083, 28, 28]} />
        <meshPhysicalMaterial color={look.lip} roughness={0.4} metalness={0.03} clearcoat={0.18} />
      </mesh>
      <mesh position={[-0.27, -0.06, 0.04]}>
        <sphereGeometry args={[0.11, 26, 26]} />
        <meshPhysicalMaterial color={look.lip} transparent opacity={0.14} roughness={0.75} />
      </mesh>
      <mesh position={[0.27, -0.06, 0.04]}>
        <sphereGeometry args={[0.11, 26, 26]} />
        <meshPhysicalMaterial color={look.lip} transparent opacity={0.14} roughness={0.75} />
      </mesh>
      <mesh position={[-0.48, -0.1, 0.06]} castShadow>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={look.jewelry} metalness={0.82} roughness={0.25} />
      </mesh>
      <mesh position={[0.48, -0.1, 0.06]} castShadow>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color={look.jewelry} metalness={0.82} roughness={0.25} />
      </mesh>
    </group>
  );
}

function AvatarBust({ look }: { look: AvatarLook }) {
  return (
    <group position={[0, -0.36, 0]} rotation={[0.03, 0, 0]}>
      <mesh position={[0, 0.84, 0]} scale={[0.88, 1.06, 0.86]} castShadow receiveShadow>
        <sphereGeometry args={[0.62, 64, 64]} />
        <meshPhysicalMaterial color={look.skin} roughness={0.5} metalness={0.03} clearcoat={0.1} />
      </mesh>
      <mesh position={[0, 0.2, -0.02]} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 0.62, 12, 28]} />
        <meshPhysicalMaterial color={look.skin} roughness={0.5} metalness={0.02} clearcoat={0.06} />
      </mesh>
      <mesh position={[0, -0.28, -0.1]} scale={[1.6, 0.56, 0.88]} castShadow receiveShadow>
        <sphereGeometry args={[0.68, 48, 48]} />
        <meshPhysicalMaterial color={look.skin} roughness={0.56} metalness={0.02} clearcoat={0.05} />
      </mesh>
      <FaceFeatures look={look} />
      <HairShape look={look} />
    </group>
  );
}

function StudioLighting({ preset }: { preset: LightingPreset }) {
  return (
    <>
      <hemisphereLight
        args={[preset.ambient, "#cabcae", preset.intensity.ambient]}
        position={[0, 1.8, 0]}
      />
      <directionalLight
        castShadow
        color={preset.key}
        intensity={preset.intensity.key}
        position={[2.8, 2.6, 3.5]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight
        color={preset.fill}
        intensity={preset.intensity.fill}
        position={[-2.5, 1.7, 2.4]}
      />
      <spotLight
        color={preset.rim}
        intensity={preset.intensity.rim}
        angle={0.45}
        penumbra={0.8}
        position={[0, 1.9, -2.8]}
      />
    </>
  );
}

function LightingControls({
  active,
  onChange
}: {
  active: LightingPresetId;
  onChange: (value: LightingPresetId) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
      {lightingPresets.map((preset) => {
        const isActive = preset.id === active;

        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
              isActive
                ? "border-ink/30 bg-ink text-paper shadow-soft"
                : "border-ink/15 bg-paper/80 text-ink/80 hover:border-ink/35 hover:bg-paper"
            }`}
          >
            {preset.label}
          </button>
        );
      })}
    </div>
  );
}

export function VirtualModel({
  selections = getInitialSelections(),
  palette,
  className
}: VirtualModelProps) {
  const [activePreset, setActivePreset] =
    useState<LightingPresetId>("natural-daylight");
  const look = useMemo(() => buildAvatarLook(selections), [selections]);
  const preset = lightingPresets.find((item) => item.id === activePreset) ?? lightingPresets[0];
  const paletteColors = palette?.slice(0, 4).map((item) => item.hex) ?? [];

  return (
    <div
      className={`rounded-2xl border border-ink/10 bg-gradient-to-b from-[#fff8f1] to-[#f4ece3] p-4 shadow-soft sm:p-5 ${className ?? ""}`}
      role="img"
      aria-label="Stylized editorial beauty avatar preview"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
          Procedural 3D preview
        </p>
        <span className="rounded-full border border-ink/10 bg-paper/80 px-3 py-1 text-[11px] font-medium text-ink/70">
          {preset.label}
        </span>
      </div>

      <div
        className="mt-3 overflow-hidden rounded-2xl border border-ink/10"
        style={{ backgroundImage: preset.background }}
      >
        <div className="h-[320px] w-full sm:h-[380px]">
          <Canvas dpr={[1, 1.5]} shadows camera={{ position: [0, 0.52, 3.45], fov: 28 }}>
            <color attach="background" args={["#f2e9dd"]} />
            <StudioLighting preset={preset} />
            <AvatarBust look={look} />
            <ContactShadows position={[0, -1.32, 0]} opacity={0.32} scale={4.8} blur={2.2} far={2.2} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minAzimuthAngle={-0.35}
              maxAzimuthAngle={0.35}
              minPolarAngle={1.25}
              maxPolarAngle={1.75}
            />
          </Canvas>
        </div>
      </div>

      <LightingControls active={activePreset} onChange={setActivePreset} />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-paper/70 px-3 py-2">
        <p className="text-xs text-ink/60">
          Smooth procedural bust. Swap with a GLB later by replacing `AvatarBust` internals and keeping props/lighting controls.
        </p>
        {paletteColors.length > 0 ? (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {paletteColors.map((hex) => (
              <span
                key={hex}
                className="h-5 w-5 rounded-full border border-white/70 shadow-sm"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
