import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import {
  COMMON_PREGENERATED_VARIANTS,
  PORTRAIT_BASE_IMAGE_VERSION,
  getGeneratedPortraitObjectKey,
  normalizePortraitEditDescriptor,
  type PortraitEditDescriptor
} from "../lib/cache/cacheKey";

const demoModelIds = [
  "model-01",
  "model-02",
  "model-03",
  "model-04",
  "model-05",
  "model-06",
  "model-07",
  "model-08",
  "model-09"
];

const endpoint = process.env.AI_PORTRAIT_EDIT_ENDPOINT;
const apiKey = process.env.AI_PORTRAIT_EDIT_API_KEY;
const lightingPreset = process.env.PORTRAIT_PREGEN_LIGHTING ?? "daylight";
const rootDir = process.cwd();

async function generateVariant(descriptor: PortraitEditDescriptor): Promise<void> {
  if (!endpoint) {
    console.log(
      `Skipping ${descriptor.modelId}/${descriptor.editType}/${descriptor.valueName}: AI_PORTRAIT_EDIT_ENDPOINT is not configured.`
    );
    return;
  }

  const normalized = normalizePortraitEditDescriptor(descriptor);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {})
    },
    body: JSON.stringify({
      ...normalized,
      currentImageUrl: `/models/${normalized.modelId}.png`
    })
  });

  if (!response.ok) {
    throw new Error(
      `Failed ${descriptor.modelId}/${descriptor.editType}/${descriptor.valueName}: ${response.status}`
    );
  }

  const payload = (await response.json()) as { imageUrl?: string; imageBase64?: string };
  const outputPath = join(
    rootDir,
    "public",
    getGeneratedPortraitObjectKey(descriptor)
  );

  await mkdir(dirname(outputPath), { recursive: true });

  if (payload.imageBase64) {
    await writeFile(outputPath, Buffer.from(payload.imageBase64, "base64"));
    console.log(`Wrote ${outputPath}`);
    return;
  }

  if (payload.imageUrl) {
    const image = await fetch(payload.imageUrl);

    if (!image.ok) {
      throw new Error(`Could not download generated image ${payload.imageUrl}`);
    }

    await writeFile(outputPath, Buffer.from(await image.arrayBuffer()));
    console.log(`Wrote ${outputPath}`);
    return;
  }

  throw new Error("AI endpoint did not return imageUrl or imageBase64.");
}

async function main(): Promise<void> {
  for (const modelId of demoModelIds) {
    for (const variant of COMMON_PREGENERATED_VARIANTS) {
      await generateVariant({
        modelId,
        baseImageVersion: PORTRAIT_BASE_IMAGE_VERSION,
        lightingPreset,
        currentImageUrl: `/models/${modelId}.png`,
        ...variant
      });
    }
  }
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
