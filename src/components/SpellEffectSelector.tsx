import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import MagicIcon from '@mui/icons-material/AutoAwesome'; // Placeholder icon

const dummySpellEffects = [
  'Fire Damage',
  'Frost Damage',
  'Shock Damage',
  'Restore Health',
  'Invisibility',
  'Paralyze',
  'Water Breathing',
  'Chameleon',
  'Burden',
  'Fortify Strength',
  'Absorb Magicka',
];

export default function SpellEffectSelector() {
  const [search, setSearch] = useState('');

  const filteredEffects = dummySpellEffects.filter((effect) =>
    effect.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEffectClick = (effect: string) => {
    console.log('Selected effect:', effect);
  };

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
              key={effect}
              variant="outlined"
              fullWidth
              onClick={() => handleEffectClick(effect)}
              className="justify-start text-left normal-case"
            >
              <div className="flex w-full items-center gap-3 px-1 py-2">
                <MagicIcon fontSize="small" />
                <span className="flex-1">{effect}</span>
              </div>
            </Button>
          ))}

          {filteredEffects.length === 0 && <div className="text-sm italic">No effects found.</div>}
        </div>

        {/* Scroll shadow hint */}
      </div>
    </div>
  );
}
