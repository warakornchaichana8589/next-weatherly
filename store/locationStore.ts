// store/locationStore.ts
"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { LocationWeather } from "@/type/weather";
import getLocations from "@/lib/locations";
import { fetcher } from "@/lib/fetcher";
import { toast } from "react-toastify";
export type NewLocationPayload = {
  name: string;
  lat: number;
  lon: number;
  timezone: string;
};

type LocationState = {
  locations: LocationWeather[];
  selected?: LocationWeather;
  loading: boolean;
  error: string | null;
  compareMode: boolean;
  compareSelection: [number | null, number | null];

  fetchLocations: () => Promise<void>;
  addLocation: (payload: NewLocationPayload) => Promise<void>;
  setSelectedById: (id: number) => void;
  setSelected: (loc: LocationWeather) => void;
  toggleFollow: (id: number, next?: boolean) => Promise<void>;
  removeLocation: (id: number) => Promise<void>;
  setCompareMode: (enabled: boolean) => void;
  setCompareSelection: (slot: 0 | 1, id: number | null) => void;
  upsert: (loc: LocationWeather) => void;
  clearError: () => void;
};

function reconcileSelected(
  incoming: LocationWeather[],
  prevSelected?: LocationWeather,
): LocationWeather | undefined {
  if (!incoming.length) return undefined;
  if (!prevSelected) return incoming[0];
  return incoming.find((loc) => loc.id === prevSelected.id) ?? incoming[0];
}

function reconcileCompareSelection(
  selection: [number | null, number | null],
  incoming: LocationWeather[],
): [number | null, number | null] {
  const ids = new Set(incoming.map((loc) => loc.id));
  return [
    selection[0] && ids.has(selection[0]) ? selection[0] : null,
    selection[1] && ids.has(selection[1]) ? selection[1] : null,
  ];
}

export const useLocationStore = create<LocationState>()(
  persist(
    devtools((set, get) => ({
      locations: [],
      selected: undefined,
      loading: false,
      error: null,
      compareMode: false,
      compareSelection: [null, null],

      async fetchLocations() {
        set({ loading: true, error: null });
        try {
          const res = await getLocations();
          const list = Array.isArray(res.locations) ? res.locations : [];
          set((state) => ({
            locations: list,
            selected: reconcileSelected(list, state.selected),
            compareSelection: reconcileCompareSelection(state.compareSelection, list),
            loading: false,
          }));
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to load locations";
          set({ error: message, loading: false });
        }
      },

      async addLocation(payload) {
        set({ loading: true, error: null });
        try {
          const res = await fetcher<{ location: LocationWeather }>(`/api/locations`, {
            method: "POST",
            body: JSON.stringify(payload),
            useAuth: true,
          });
          set((state) => {
            const locations = [...state.locations, res.location];
            return {
              locations,
              selected: state.selected ?? res.location,
              loading: false,
            };
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to add location";
          set({ error: message, loading: false });
        }
      },

      setSelectedById(id) {
        const loc = get().locations.find((l) => l.id === id);
        if (loc) set({ selected: loc });
      },

      setSelected(loc) {
        set({ selected: loc });
      },

      async toggleFollow(id, next) {
        const target = get().locations.find((loc) => loc.id === id);
        if (!target) return;
        const desired = next ?? !target.isFollowed;
        try {
          const res = await fetcher<{ location: LocationWeather }>(`/api/locations`, {
            method: "PATCH",
            body: JSON.stringify({ id, isFollowed: desired }),
            useAuth: true,
          });
          set((state) => {
            const locations = state.locations.map((loc) =>
              loc.id === id ? res.location : loc,
            );
            const selected =
              state.selected && state.selected.id === id ? res.location : state.selected;
            return { locations, selected };
          });
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Failed to update follow status";
          set({ error: message });
        }
      },

      async removeLocation(id) {
        set({ error: null });
        try {
          await fetcher(`/api/locations?id=${id}`, {
            method: "DELETE",
            useAuth: true,
          });
          toast.success("ลบ location สำเร็จแล้ว");
          set((state) => {
            const nextLocations = state.locations.filter((loc) => loc.id !== id);
            return {
              locations: nextLocations,
              selected: reconcileSelected(nextLocations, state.selected),
              compareSelection: reconcileCompareSelection(state.compareSelection, nextLocations),
            };
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Failed to remove location";
          set({ error: message });
        }
      },

      setCompareMode(enabled) {
        set((state) => ({
          compareMode: enabled,
          compareSelection: enabled ? state.compareSelection : [null, null],
        }));
      },

      setCompareSelection(slot, id) {
        set((state) => {
          const next: [number | null, number | null] = [...state.compareSelection] as [
            number | null,
            number | null,
          ];
          next[slot] = id;
          return { compareSelection: next };
        });
      },

      clearError() {
        set({ error: null });
      },
      upsert: (loc) => {
        set((state) => {
          const existingIndex = state.locations.findIndex(
            (l) => l.id === loc.id || l.name === loc.name
          );

          if (existingIndex !== -1) {
           
            const updated = [...state.locations];
            updated[existingIndex] = { ...updated[existingIndex], ...loc };
            return { locations: updated };
          } else {
          
            return { locations: [...state.locations, loc] };
          }
        });
      },
    })),
    {
      name: "location-store",
      partialize: (state) => ({
        locations: state.locations,
        selected: state.selected,
        compareMode: state.compareMode,
        compareSelection: state.compareSelection,
      }),
    },
  ),
);
