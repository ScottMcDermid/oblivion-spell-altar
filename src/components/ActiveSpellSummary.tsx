import React, { useMemo } from 'react';
import { useSpellStore } from '@/data/spellStore';
import {
  School,
  SpellEffect,
  spellEffectDefinitionById,
  applySkillMultiplier,
  getMasteryFromMagickaCost,
  getMinLevelForMastery,
  Mastery,
} from '@/utils/spellEffectUtils';
import { Divider, Tooltip } from '@mui/material';
import FlashOn from '@mui/icons-material/FlashOn';
import AttachMoney from '@mui/icons-material/AttachMoney';

export default function ActiveSpellEffects() {
  const { addedEffects, skills, luck } = useSpellStore();

  const maxEffect: SpellEffect | undefined = useMemo(
    () =>
      addedEffects.reduce<SpellEffect | undefined>(
        (max, effect) =>
          !max || Math.floor(effect.magickaCost) > Math.floor(max.magickaCost) ? effect : max,
        undefined,
      ),
    [addedEffects],
  );

  const school: School | null = useMemo(
    () => (maxEffect ? spellEffectDefinitionById[maxEffect.id].school : null),
    [maxEffect],
  );

  const mastery: Mastery | null = useMemo(
    () => (maxEffect ? getMasteryFromMagickaCost(maxEffect.magickaCost) : null),
    [maxEffect],
  );

  const magickaCost = useMemo(
    () =>
      addedEffects.reduce(
        (magickaCost, effect) =>
          magickaCost +
          applySkillMultiplier(
            effect.magickaCost,
            skills[spellEffectDefinitionById[effect.id].school],
            luck,
          ),
        0,
      ),
    [addedEffects, skills, luck],
  );

  const minLevel = useMemo(() => (mastery ? getMinLevelForMastery(mastery) : 0), [mastery]);

  const goldCost = useMemo(
    () => addedEffects.reduce((goldCost, effect) => goldCost + effect.goldCost, 0),
    [addedEffects, skills],
  );

  return (
    <div className="w-full max-w-md shadow-sm">
      <Divider />
      {school && mastery && (
        <div className="mt-4 flex items-center justify-end gap-4 text-lg">
          {school} {mastery}
        </div>
      )}
      {minLevel > 0 && (
        <div className="flex items-center justify-end gap-4 text-sm">Level {minLevel}</div>
      )}
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
