import React, { useMemo } from 'react';
import { useSpellStore } from '@/data/spellStore';
import Image from 'next/image';
import {
  applySkillMultiplier,
  getGoldCost,
  SpellEffect,
  spellEffectDefinitionById,
} from '@/utils/spellEffectUtils';
import { Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { cn } from '@/utils/cn';
import SpellEffectEditor from '@/components/SpellEffectEditor';

export default function ActiveSpellEffects({
  expandedEffectId,
  onToggleExpand,
}: {
  expandedEffectId: string | null;
  onToggleExpand: (id: string) => void;
}) {
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

  const magickaCosts: number[] = useMemo(
    () =>
      addedEffects.map((effect) =>
        applySkillMultiplier(
          effect.magickaCost,
          skills[spellEffectDefinitionById[effect.id].school],
          luck,
        ),
      ),
    [skills, luck, addedEffects],
  );

  return (
    <div className="relative w-full bg-inherit">
      <div className="sticky top-0 z-10 grid grid-cols-[2rem_minmax(0,1fr)_4rem_4rem_4rem_4rem_1.5rem] items-center bg-inherit py-2 pb-2 pr-2 pt-6 text-sm font-semibold shadow-lg lg:grid-cols-[2rem_minmax(0,1fr)_6rem_4rem_6rem_4rem_6rem_6rem_1.5rem]">
        {/* Spell effect icon */}
        <span></span>

        {/* Spell effect name */}
        <span></span>

        {/* Magnitude */}
        <span className="text-right">
          <span className="inline lg:hidden">Mag.</span>
          <span className="hidden lg:inline">Magnitude</span>
        </span>

        {/* Area */}
        <span className="text-right">
          <span className="inline lg:hidden">Area</span>
          <span className="hidden lg:inline">Area</span>
        </span>

        {/* Duration */}
        <span className="text-right">
          <span className="inline lg:hidden">Dur.</span>
          <span className="hidden lg:inline">Duration</span>
        </span>

        {/* Range */}
        <span className="text-right">
          <span className="inline lg:hidden">Range</span>
          <span className="hidden lg:inline">Range</span>
        </span>

        {/* Magicka */}
        <span className="col-span-0 hidden text-right lg:col-span-1 lg:inline">Magicka</span>

        {/* Gold */}
        <span className="col-span-0 hidden text-right lg:col-span-1 lg:inline">Gold</span>

        {/* Expand chevron spacer */}
        <span></span>
      </div>
      {addedEffects.length === 0 && (
        <div className="items-center px-2 py-2 text-sm">No Active Effects</div>
      )}

      {addedEffects.map((effect, i) => {
        const isExpanded = expandedEffectId === effect.id;
        const definition = spellEffectDefinitionById[effect.id];

        return (
          <div key={effect.id}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => onToggleExpand(effect.id)}
              onKeyDown={(e) => e.key === 'Enter' && onToggleExpand(effect.id)}
              className={cn(
                'grid cursor-pointer items-center py-2 pr-2 text-sm hover:bg-[#2f2f2f]',
                'grid-cols-[2rem_minmax(0,1fr)_4rem_4rem_4rem_4rem_1.5rem]',
                'lg:grid-cols-[2rem_minmax(0,1fr)_6rem_4rem_6rem_4rem_6rem_6rem_1.5rem]',
                maxEffect && effect.id === maxEffect.id
                  ? 'border-l-4 border-l-yellow-400'
                  : 'pl-1',
              )}
            >
              {/* Spell effect icon */}
              <Tooltip title={definition.school}>
                <Image
                  width={64}
                  height={64}
                  src={`/icons/spell-effects/${effect.id}.png`}
                  alt={definition.name}
                  className="h-8 w-8 object-contain pl-1 lg:h-8 lg:w-8"
                />
              </Tooltip>

              {/* Spell effect name */}
              <span className="pl-1 lg:text-lg">
                {effect.attribute
                  ? definition.name.replace(/Attribute/, effect.attribute)
                  : effect.skill
                    ? definition.name.replace(/Skill/, effect.skill)
                    : effect.lockLevel
                      ? `${definition.name} ${effect.lockLevel} Lock`
                      : definition.name}
              </span>

              {/* Magnitude */}
              <span className="text-right">
                {definition.availableParameters.includes('Magnitude') &&
                definition.isLevelBasedMagnitude ? (
                  <span>
                    {definition.unit} {effect.magnitude}
                  </span>
                ) : (
                  <span>
                    {effect.magnitude} {definition.unit}
                  </span>
                )}
              </span>

              {/* Area */}
              <span className="text-right">
                {definition.availableParameters.includes('Area')
                  ? effect.area === 0
                    ? '-'
                    : `${effect.area} ft`
                  : ''}
              </span>

              {/* Duration */}
              <span className="text-right">
                {definition.availableParameters.includes('Duration') && `${effect.duration}s`}
              </span>

              {/* Range */}
              <span className="text-right">{effect.range}</span>

              {/* Magicka Cost */}
              <span className="col-span-0 hidden text-right lg:col-span-1 lg:inline">
                {Intl.NumberFormat().format(Math.floor(magickaCosts[i]))}
              </span>

              {/* Gold Cost */}
              <span className="col-span-0 hidden text-right lg:col-span-1 lg:inline">
                {Intl.NumberFormat().format(getGoldCost(magickaCosts[i]))}
              </span>

              {/* Expand chevron */}
              <ExpandMoreIcon
                fontSize="small"
                className={cn(
                  'transition-transform duration-200',
                  isExpanded && 'rotate-180',
                )}
              />
            </div>

            {/* Inline editor panel */}
            {isExpanded && (
              <SpellEffectEditor effect={effect} effectDefinition={definition} />
            )}
          </div>
        );
      })}
    </div>
  );
}
