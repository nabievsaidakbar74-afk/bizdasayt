export type GeoItem = { id: string; name: string };

export function geoList(payload: unknown): GeoItem[] {
  if (Array.isArray(payload)) return payload as GeoItem[];
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root.data)) return root.data as GeoItem[];
  const nested = root.data;
  if (nested && typeof nested === "object") {
    const data = nested as Record<string, unknown>;
    if (Array.isArray(data.districts)) return data.districts as GeoItem[];
    if (Array.isArray(data.mahallas)) return data.mahallas as GeoItem[];
    if (Array.isArray(data.regions)) return data.regions as GeoItem[];
  }
  if (Array.isArray(root.districts)) return root.districts as GeoItem[];
  if (Array.isArray(root.mahallas)) return root.mahallas as GeoItem[];
  return [];
}

export function geoName(list: GeoItem[], id: string) {
  return list.find((item) => item.id === id)?.name || "";
}
