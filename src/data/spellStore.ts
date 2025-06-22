import type { SpellEffect } from '@/utils/spellEffectUtils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type State = {
  addedEffects: SpellEffect[];
  version: number;
};

type Action = {
  addSpellEffect: (spellEffect: SpellEffect) => void;
  removeSpellEffect: (spellEffect: SpellEffect) => void;
};

type SpellStore = State & { actions: Action };

const useSpellStore = create<SpellStore>()(
  persist(
    (set) => {
      return {
        addedEffects: [],
        version: 1,
        actions: {
          addSpellEffect: (effect: SpellEffect) =>
            set((state) => ({ addedEffects: [...state.addedEffects, effect] })),
          removeSpellEffect: (effect: SpellEffect) =>
            set((state) => ({
              addedEffects: state.addedEffects.filter(
                (existingEffect) => effect.id !== existingEffect.id,
              ),
            })),
        },
      };
    },
    {
      name: 'oblivion-spell-altar',
      version: 1,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        addedEffects: state.addedEffects,
        version: state.version,
      }),
    },
  ),
);

export { useSpellStore };
