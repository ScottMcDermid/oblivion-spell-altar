import React from 'react';
import { useSpellStore } from '@/data/spellStore';
import { spellEffectDefinitionById } from '@/utils/spellEffectUtils';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ActiveSpellEffects() {
  const {
    addedEffects,
    actions: { removeSpellEffect },
  } = useSpellStore();

  return (
    <div className="w-full max-w-md p-4 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">Active Effects</h2>

      <div className="w-full">
        <div className="grid grid-cols-[2rem_1fr_4rem_4rem_4rem_4rem_2rem] border-b pb-2 text-sm font-semibold">
          <span> </span>
          <span> </span>
          <span className="text-right">Mag.</span>
          <span className="text-right">Area</span>
          <span className="text-right">Dur.</span>
          <span className="text-right">Range</span>
          <span></span>
        </div>
        {addedEffects.map((effect) => (
          <div
            key={effect.id}
            className="grid grid-cols-[2rem_1fr_4rem_4rem_4rem_4rem_2rem] items-center border-b py-2 text-sm last:border-b-0"
          >
            <img
              src={`/icons/spell-effects/${effect.id}.png`}
              alt={spellEffectDefinitionById[effect.id].name}
              className="h-5 w-5 object-contain"
            />
            <span>{spellEffectDefinitionById[effect.id].name}</span>
            <span className="text-right">{effect.magnitude} pts</span>
            <span className="text-right">{effect.area} ft</span>
            <span className="text-right">{effect.duration} sec</span>
            <span className="text-right">{effect.range}</span>
            <Tooltip title="Remove">
              <IconButton
                className="p-0 px-1"
                aria-label="Delete"
                onClick={() => removeSpellEffect(effect)}
                sx={(theme) => ({
                  color: theme.palette.grey[500],
                })}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        ))}
      </div>
    </div>
  );
}
