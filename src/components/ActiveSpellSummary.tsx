import React, { useMemo } from 'react';
import { useSpellStore } from '@/data/spellStore';
import { School, SpellEffect, spellEffectDefinitionById } from '@/utils/spellEffectUtils';
import { Tooltip } from '@mui/material';
import FlashOn from '@mui/icons-material/FlashOn';
import AttachMoney from '@mui/icons-material/AttachMoney';

export default function ActiveSpellEffects({ skill }: { skill: number }) {
  const { addedEffects } = useSpellStore();

  const school = useMemo<School | null>(() => {
    const maxEffect = addedEffects.reduce<SpellEffect | undefined>(
      (max, effect) => (!max || effect.magickaCost > max.magickaCost ? effect : max),
      undefined,
    );
    return maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null;
  }, [addedEffects, skill]);

  const magickaCost = useMemo(
    () => addedEffects.reduce((magickaCost, effect) => magickaCost + effect.magickaCost, 0),
    [addedEffects, skill],
  );

  const goldCost = useMemo(
    () => addedEffects.reduce((goldCost, effect) => goldCost + effect.goldCost, 0),
    [addedEffects, skill],
  );

  return (
    <div className="w-full max-w-md p-4 shadow-sm">
      {school && <div>School: {school}</div>}
      <div className="mt-4 flex items-center gap-4 text-lg">
        <Tooltip title="Magicka Cost">
          <div className="flex items-center gap-1">
            <FlashOn fontSize="small" />
            <span>{Intl.NumberFormat().format(magickaCost)}</span>
          </div>
        </Tooltip>

        <Tooltip title="Gold/Barter Cost">
          <div className="flex items-center gap-1">
            <AttachMoney fontSize="small" />
            <span>{Intl.NumberFormat().format(goldCost)}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}
