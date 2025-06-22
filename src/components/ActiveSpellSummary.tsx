import React, { useMemo } from 'react';
import { useSpellStore } from '@/data/spellStore';
import {
  School,
  SpellEffect,
  spellEffectDefinitionById,
  applySkillMultiplier,
} from '@/utils/spellEffectUtils';
import { Divider, Tooltip } from '@mui/material';
import FlashOn from '@mui/icons-material/FlashOn';
import AttachMoney from '@mui/icons-material/AttachMoney';

export default function ActiveSpellEffects() {
  const { addedEffects, skills } = useSpellStore();

  const school = useMemo<School | null>(() => {
    const maxEffect = addedEffects.reduce<SpellEffect | undefined>(
      (max, effect) => (!max || effect.magickaCost > max.magickaCost ? effect : max),
      undefined,
    );
    return maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null;
  }, [addedEffects]);

  const magickaCost = useMemo(
    () =>
      addedEffects.reduce(
        (magickaCost, effect) =>
          magickaCost +
          applySkillMultiplier(
            effect.magickaCost,
            skills[spellEffectDefinitionById[effect.id].school],
          ),
        0,
      ),
    [addedEffects, skills],
  );

  const goldCost = useMemo(
    () => addedEffects.reduce((goldCost, effect) => goldCost + effect.goldCost, 0),
    [addedEffects, skills],
  );

  return (
    <div className="w-full max-w-md shadow-sm">
      <h2 className="text-md mb-1 text-center font-semibold">Summary</h2>
      <Divider />
      {school && <div className="mt-4 flex items-center justify-end gap-4 text-lg">{school}</div>}
      <div className="mt-4 flex justify-end gap-4 text-lg">
        <div className="mt-4 flex items-center gap-4 text-lg">
          <Tooltip title="Magicka Cost">
            <div className="flex items-center gap-1">
              <FlashOn fontSize="small" />
              <span>{Intl.NumberFormat().format(magickaCost)}</span>
            </div>
          </Tooltip>

          <Tooltip title="Gold Cost">
            <div className="flex items-center gap-1">
              <AttachMoney fontSize="small" />
              <span>{Intl.NumberFormat().format(goldCost)}</span>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
