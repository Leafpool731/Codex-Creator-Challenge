import modelAttributeData from "@/data/modelAttributes.json";
import type {
  AttributeKey,
  ModelAttributeData,
  ModelAttributeGroup,
  ModelOption,
  UserSelections
} from "@/lib/types";

export const modelAttributes = modelAttributeData as ModelAttributeData;

export const attributeOrder = modelAttributes.groups.map(
  (group) => group.id
) as AttributeKey[];

export function getAttributeGroup(key: AttributeKey): ModelAttributeGroup {
  const group = modelAttributes.groups.find((item) => item.id === key);

  if (!group) {
    throw new Error(`Unknown model attribute: ${key}`);
  }

  return group;
}

export function getAttributeOption(
  key: AttributeKey,
  optionId: string
): ModelOption {
  const group = getAttributeGroup(key);
  return (
    group.options.find((option) => option.id === optionId) ?? group.options[0]
  );
}

export function getInitialSelections(): UserSelections {
  return modelAttributes.groups.reduce((accumulator, group) => {
    accumulator[group.id] = group.defaultOption;
    return accumulator;
  }, {} as UserSelections);
}

export function normalizeSelections(
  input?: Partial<Record<AttributeKey, string | string[] | undefined>>
): UserSelections {
  const defaults = getInitialSelections();

  if (!input) {
    return defaults;
  }

  return modelAttributes.groups.reduce((accumulator, group) => {
    const rawValue = input[group.id];
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    const exists = group.options.some((option) => option.id === value);

    accumulator[group.id] = exists && value ? value : group.defaultOption;
    return accumulator;
  }, {} as UserSelections);
}

export function selectionsToSearchParams(selections: UserSelections): string {
  const params = new URLSearchParams();

  attributeOrder.forEach((key) => {
    params.set(key, selections[key]);
  });

  return params.toString();
}

export function getSelectionLabels(selections: UserSelections) {
  return attributeOrder.map((key) => ({
    key,
    label: getAttributeGroup(key).label,
    value: getAttributeOption(key, selections[key]).label
  }));
}
