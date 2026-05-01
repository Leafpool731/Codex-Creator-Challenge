"use client";

import { AIFeatureEditStatus } from "@/components/AIFeatureEditStatus";
import { SegmentedControl } from "@/components/SegmentedControl";
import { SliderControl } from "@/components/SliderControl";
import { SwatchSelector } from "@/components/SwatchSelector";
import type { PortraitEditUiState } from "@/hooks/usePortraitEdit";
import { usePortraitStudio, type Undertone } from "@/lib/portraitStudioStore";

const undertoneOptions: Array<{ id: Undertone; label: string }> = [
  { id: "cool", label: "Cool" },
  { id: "neutral", label: "Neutral" },
  { id: "warm", label: "Warm" },
  { id: "olive", label: "Olive" }
];

interface FeatureEditorProps {
  activeTab: "Skin" | "Hair" | "Eyes" | "Features";
  aiState?: PortraitEditUiState;
}

export function FeatureEditor({ activeTab, aiState }: FeatureEditorProps) {
  const {
    state,
    setState,
    skinTones,
    hairColors,
    eyeColors,
    lipColors
  } = usePortraitStudio();

  return (
    <div className="space-y-4">
      {(activeTab === "Hair" || activeTab === "Eyes" || activeTab === "Features") &&
        aiState && (
          <div className="flex justify-end">
            <AIFeatureEditStatus state={aiState} />
          </div>
        )}

      {activeTab === "Skin" ? (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-[#4f443f]">Skin tone</p>
            <SwatchSelector
              value={state.skinTone}
              options={skinTones}
              onChange={(skinTone) => setState({ skinTone })}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-[#4f443f]">Undertone</p>
            <SegmentedControl
              value={state.undertone}
              options={undertoneOptions}
              onChange={(undertone) =>
                setState({ undertone: undertone as Undertone })
              }
            />
          </div>
          <SliderControl
            label="Depth"
            value={state.depth}
            onChange={(depth) => setState({ depth })}
            minLabel="Fair"
            maxLabel="Deep"
          />
          <SliderControl
            label="Saturation"
            value={state.saturation}
            onChange={(saturation) => setState({ saturation })}
            minLabel="Muted"
            maxLabel="Vibrant"
          />
          <SliderControl
            label="Freckles"
            value={state.freckles}
            onChange={(freckles) => setState({ freckles })}
            minLabel="0%"
            maxLabel="100%"
          />
          <SliderControl
            label="Blush"
            value={state.blush}
            onChange={(blush) => setState({ blush })}
            minLabel="0%"
            maxLabel="100%"
          />
        </>
      ) : null}

      {activeTab === "Hair" ? (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-[#4f443f]">Hair color</p>
            <SwatchSelector
              value={state.hairColor}
              options={hairColors}
              onChange={(hairColor) => setState({ hairColor })}
            />
          </div>
          <SliderControl
            label="Hair intensity"
            value={state.hairIntensity}
            onChange={(hairIntensity) => setState({ hairIntensity })}
            minLabel="Subtle"
            maxLabel="Strong"
          />
        </>
      ) : null}

      {activeTab === "Eyes" ? (
        <div>
          <p className="mb-2 text-sm font-medium text-[#4f443f]">Eye color</p>
          <SwatchSelector
            value={state.eyeColor}
            options={eyeColors}
            onChange={(eyeColor) => setState({ eyeColor })}
          />
        </div>
      ) : null}

      {activeTab === "Features" ? (
        <>
          <div>
            <p className="mb-2 text-sm font-medium text-[#4f443f]">Lip color</p>
            <SwatchSelector
              value={state.lipColor}
              options={lipColors}
              onChange={(lipColor) => setState({ lipColor })}
            />
          </div>
          <SliderControl
            label="Lip tint"
            value={state.lipTint}
            onChange={(lipTint) => setState({ lipTint })}
            minLabel="Bare"
            maxLabel="Tinted"
          />
          <SliderControl
            label="Freckles"
            value={state.freckles}
            onChange={(freckles) => setState({ freckles })}
            minLabel="0%"
            maxLabel="100%"
          />
          <SliderControl
            label="Blush"
            value={state.blush}
            onChange={(blush) => setState({ blush })}
            minLabel="0%"
            maxLabel="100%"
          />
        </>
      ) : null}
    </div>
  );
}
