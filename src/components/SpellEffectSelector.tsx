import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import Image from 'next/image';

import { spellEffectDefinitions, type SpellEffectDefinition } from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';

export default function SpellEffectSelector({
  onEffectSelect,
}: {
  onEffectSelect: (effect: SpellEffectDefinition) => void;
}) {
  const [search, setSearch] = useState('');

  const { addedEffects } = useSpellStore();

  const filteredEffects: SpellEffectDefinition[] = spellEffectDefinitions.filter((effect) => {
    const addedSpellEffectIds = addedEffects.map((effect) => effect.id);
    return (
      effect.name.toLowerCase().includes(search.toLowerCase()) &&
      !addedSpellEffectIds.includes(effect.id)
    );
  });

  return (
    <div className="w-full max-w-md p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Spell Effects</h2>

      <TextField
        label="Search Effects"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />

      <div className="relative">
        <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
          {filteredEffects.map((effect) => (
            <Button
              key={effect.id}
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearch('');
                onEffectSelect(effect);
              }}
              className="justify-start text-left normal-case"
            >
              <div className="flex w-full items-center gap-3 px-1 py-2">
                <Image
                  src={`/icons/spell-effects/${effect.id}.png`}
                  width={24}
                  height={24}
                  alt={effect.name}
                />
                <span className="flex-1">{effect.name}</span>
              </div>
            </Button>
          ))}

          {filteredEffects.length === 0 && <div className="text-sm italic">No effects found.</div>}
        </div>
      </div>
    </div>
  );
}
