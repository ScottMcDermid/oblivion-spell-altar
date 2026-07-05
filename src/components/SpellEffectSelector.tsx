import React, { useState } from 'react';
import { TextField, Button, Chip, Tooltip } from '@mui/material';
import Image from 'next/image';

import {
  schools,
  spellEffectDefinitions,
  type School,
  type SpellEffectDefinition,
} from '@/utils/spellEffectUtils';
import { useSpellStore } from '@/data/spellStore';

export default function SpellEffectSelector({
  onEffectSelect,
}: {
  onEffectSelect: (effect: SpellEffectDefinition) => void;
}) {
  const [search, setSearch] = useState('');
  const [schoolFilter, setSchoolFilter] = useState<School | null>(null);

  const { addedEffects } = useSpellStore();

  const filteredEffects: SpellEffectDefinition[] = spellEffectDefinitions.filter((effect) => {
    const addedSpellEffectIds = addedEffects.map((effect) => effect.id);
    return (
      effect.name.toLowerCase().includes(search.toLowerCase()) &&
      !addedSpellEffectIds.includes(effect.id) &&
      (schoolFilter === null || effect.school === schoolFilter)
    );
  });

  return (
    <div className="flex h-full flex-col">
      <TextField
        label="Search Effects"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-2 px-2"
      />

      <div className="mb-2 flex flex-wrap gap-1 px-2">
        {schools.map((school) => (
          <Chip
            key={school}
            label={school}
            size="small"
            variant={schoolFilter === school ? 'filled' : 'outlined'}
            color={schoolFilter === school ? 'primary' : 'default'}
            onClick={() => setSchoolFilter(schoolFilter === school ? null : school)}
            className="text-xs"
          />
        ))}
      </div>

      <div className="min-h-0 flex-1">
        <div className="h-full space-y-1 overflow-y-auto rounded-md border border-[#2e2e2e] p-1.5">
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
              <div className="flex items-center gap-2 p-0.5">
                <Tooltip title={effect.school}>
                  <Image
                    src={`/icons/spell-effects/${effect.id}.png`}
                    width={64}
                    height={64}
                    alt={effect.name}
                    className="h-7 w-7 lg:h-9 lg:w-9"
                  />
                </Tooltip>
                <span className="flex-1 text-sm lg:text-base">{effect.name}</span>
              </div>
            </Button>
          ))}

          {filteredEffects.length === 0 && <div className="text-sm italic">No effects found.</div>}
        </div>
      </div>
    </div>
  );
}
